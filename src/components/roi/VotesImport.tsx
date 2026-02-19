import { useState } from "react";
import Papa from "papaparse";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, FileText, AlertCircle } from "lucide-react";

interface VotesImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateId: string;
}

interface ParsedRow {
  zona: string;
  secao: string;
  votos: number;
}

const VotesImport = ({ open, onOpenChange, candidateId }: VotesImportProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setErrors([]);
    setPreview([]);

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errs: string[] = [];
        const rows: ParsedRow[] = [];
        const seen = new Set<string>();

        for (let i = 0; i < results.data.length; i++) {
          const row = results.data[i] as any;
          const zona = (row.zona || row.Zona || "").toString().trim();
          const secao = (row.secao || row.Secao || row["seção"] || row["Seção"] || "").toString().trim();
          const votosRaw = row.votos || row.Votos || "0";
          const votos = parseInt(votosRaw, 10);

          if (!zona || !secao) {
            errs.push(`Linha ${i + 2}: zona ou seção vazia`);
            continue;
          }
          if (isNaN(votos) || votos < 0) {
            errs.push(`Linha ${i + 2}: votos inválido "${votosRaw}"`);
            continue;
          }

          const key = `${zona}|${secao}`;
          if (seen.has(key)) {
            errs.push(`Linha ${i + 2}: duplicata zona=${zona} seção=${secao} (ignorada)`);
            continue;
          }
          seen.add(key);
          rows.push({ zona, secao, votos });
        }

        if (rows.length === 0 && errs.length === 0) {
          errs.push("CSV vazio ou colunas não reconhecidas. Use: zona, secao, votos");
        }

        setPreview(rows);
        setErrors(errs);
      },
      error: () => {
        setErrors(["Erro ao processar o arquivo CSV"]);
      },
    });
  };

  const handleImport = async () => {
    if (preview.length === 0 || !candidateId) return;
    setImporting(true);

    try {
      const inserts = preview.map((r) => ({
        candidate_id: candidateId,
        zone: r.zona,
        section: r.secao,
        votes: r.votos,
      }));

      const { error } = await supabase.from("votes_raw").insert(inserts);
      if (error) throw error;

      // Recalculate votes_agg
      const totalVotes = preview.reduce((sum, r) => sum + r.votos, 0);

      const { data: existing } = await supabase
        .from("votes_agg")
        .select("id, total_votes")
        .eq("candidate_id", candidateId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("votes_agg")
          .update({ total_votes: existing.total_votes + totalVotes, last_updated: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("votes_agg")
          .insert({ candidate_id: candidateId, total_votes: totalVotes });
      }

      toast({ title: "Importação concluída!", description: `${preview.length} registros importados com ${totalVotes} votos.` });
      onOpenChange(false);
      setFile(null);
      setPreview([]);
      setErrors([]);
    } catch (err: any) {
      toast({ title: "Erro na importação", description: err.message, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Dados de Votação
          </DialogTitle>
          <DialogDescription>
            Envie um CSV com colunas: <strong>zona</strong>, <strong>secao</strong>, <strong>votos</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Arquivo CSV</Label>
            <Input type="file" accept=".csv" onChange={handleFileChange} />
          </div>

          {errors.length > 0 && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 space-y-1 text-sm max-h-32 overflow-y-auto">
              <div className="flex items-center gap-1 font-medium"><AlertCircle className="w-4 h-4" /> Avisos</div>
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          {preview.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {preview.length} registros prontos • {preview.reduce((s, r) => s + r.votos, 0).toLocaleString("pt-BR")} votos
              </p>
              <div className="max-h-40 overflow-y-auto border rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-2">Zona</th>
                      <th className="text-left p-2">Seção</th>
                      <th className="text-right p-2">Votos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 20).map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{r.zona}</td>
                        <td className="p-2">{r.secao}</td>
                        <td className="p-2 text-right">{r.votos}</td>
                      </tr>
                    ))}
                    {preview.length > 20 && (
                      <tr className="border-t">
                        <td colSpan={3} className="p-2 text-center text-muted-foreground">
                          ... e mais {preview.length - 20} registros
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleImport} disabled={preview.length === 0 || importing}>
            {importing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Importar {preview.length} registros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VotesImport;
