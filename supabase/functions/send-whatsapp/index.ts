import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { campanha_id, titulo, conteudo, target_cidade, target_roles } = await req.json();

    if (!campanha_id || !titulo || !conteudo) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build query to get supporters with phone numbers
    let query = supabase
      .from("supporters")
      .select("id, nome, telefone")
      .eq("campanha_id", campanha_id)
      .not("telefone", "is", null)
      .neq("telefone", "");

    if (target_cidade) {
      query = query.eq("cidade", target_cidade);
    }

    const { data: supporters, error: suppError } = await query;

    if (suppError) {
      console.error("Erro ao buscar apoiadores:", suppError);
      return new Response(JSON.stringify({ error: "Erro ao buscar destinatários" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const recipients = supporters || [];

    // Check if real WhatsApp credentials are configured
    const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
    const templateName = Deno.env.get("WHATSAPP_TEMPLATE_NAME") || "orientacao_campanha";
    const isSimulation = !accessToken || !phoneNumberId;

    const results: { nome: string; telefone: string; status: string; simulated: boolean }[] = [];

    for (const s of recipients) {
      const phone = s.telefone?.replace(/\D/g, "");
      if (!phone || phone.length < 10) {
        results.push({ nome: s.nome, telefone: s.telefone, status: "telefone_invalido", simulated: isSimulation });
        continue;
      }

      const fullPhone = phone.startsWith("55") ? phone : `55${phone}`;

      if (isSimulation) {
        // Simulation mode - log but don't actually send
        console.log(`[SIMULAÇÃO] WhatsApp para ${s.nome} (${fullPhone}): ${titulo} - ${conteudo}`);
        results.push({ nome: s.nome, telefone: s.telefone, status: "simulado_ok", simulated: true });
      } else {
        // Real Meta Cloud API call
        try {
          const res = await fetch(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: fullPhone,
                type: "template",
                template: {
                  name: templateName,
                  language: { code: "pt_BR" },
                  components: [
                    {
                      type: "body",
                      parameters: [
                        { type: "text", text: `${titulo}: ${conteudo}`.substring(0, 1024) },
                      ],
                    },
                  ],
                },
              }),
            }
          );

          const result = await res.json();
          if (res.ok) {
            results.push({ nome: s.nome, telefone: s.telefone, status: "enviado", simulated: false });
          } else {
            console.error(`Erro WhatsApp para ${fullPhone}:`, result);
            results.push({ nome: s.nome, telefone: s.telefone, status: "erro", simulated: false });
          }
        } catch (err) {
          console.error(`Erro de rede para ${fullPhone}:`, err);
          results.push({ nome: s.nome, telefone: s.telefone, status: "erro_rede", simulated: false });
        }
      }
    }

    const enviados = results.filter(r => r.status === "enviado" || r.status === "simulado_ok").length;

    return new Response(
      JSON.stringify({
        success: true,
        simulation: isSimulation,
        total_destinatarios: recipients.length,
        enviados,
        detalhes: results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Erro geral:", err);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
