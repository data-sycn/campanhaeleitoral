export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          details: Json | null
          entity: string
          entity_id: string | null
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      budgets: {
        Row: {
          active: boolean | null
          candidate_id: string
          created_at: string | null
          id: string
          notes: string | null
          total_planned: number
          updated_at: string | null
          year: number
        }
        Insert: {
          active?: boolean | null
          candidate_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          total_planned: number
          updated_at?: string | null
          year: number
        }
        Update: {
          active?: boolean | null
          candidate_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          total_planned?: number
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "budgets_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          number: string | null
          party: string | null
          uf: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name: string
          number?: string | null
          party?: string | null
          uf: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          number?: string | null
          party?: string | null
          uf?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          candidate_id: string
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string | null
          created_by: string
          date: string
          description: string
          document_url: string | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          candidate_id: string
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          created_by: string
          date: string
          description: string
          document_url?: string | null
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          candidate_id?: string
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string
          document_url?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id: string
          name: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      supporters: {
        Row: {
          active: boolean | null
          candidate_id: string
          created_at: string | null
          id: string
          role_note: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          candidate_id: string
          created_at?: string | null
          id?: string
          role_note?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          candidate_id?: string
          created_at?: string | null
          id?: string
          role_note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supporters_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      votes_agg: {
        Row: {
          candidate_id: string
          created_at: string | null
          id: string
          municipio: string
          uf: string
          updated_at: string | null
          votos_total: number
          year: number
        }
        Insert: {
          candidate_id: string
          created_at?: string | null
          id?: string
          municipio: string
          uf: string
          updated_at?: string | null
          votos_total: number
          year: number
        }
        Update: {
          candidate_id?: string
          created_at?: string | null
          id?: string
          municipio?: string
          uf?: string
          updated_at?: string | null
          votos_total?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "votes_agg_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      votes_raw: {
        Row: {
          candidate_id: string | null
          candidate_number: string
          created_at: string | null
          id: string
          municipio: string
          secao: string | null
          turno: number | null
          uf: string
          votos: number
          year: number
          zona: string | null
        }
        Insert: {
          candidate_id?: string | null
          candidate_number: string
          created_at?: string | null
          id?: string
          municipio: string
          secao?: string | null
          turno?: number | null
          uf: string
          votos: number
          year: number
          zona?: string | null
        }
        Update: {
          candidate_id?: string | null
          candidate_number?: string
          created_at?: string | null
          id?: string
          municipio?: string
          secao?: string | null
          turno?: number | null
          uf?: string
          votos?: number
          year?: number
          zona?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_raw_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_candidate_id: {
        Args: { _user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "candidate" | "supporter"
      expense_category:
        | "marketing"
        | "eventos"
        | "material_grafico"
        | "combustivel"
        | "alimentacao"
        | "hospedagem"
        | "servicos_profissionais"
        | "outros"
      payment_method:
        | "dinheiro"
        | "cartao_credito"
        | "cartao_debito"
        | "pix"
        | "transferencia"
        | "cheque"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "candidate", "supporter"],
      expense_category: [
        "marketing",
        "eventos",
        "material_grafico",
        "combustivel",
        "alimentacao",
        "hospedagem",
        "servicos_profissionais",
        "outros",
      ],
      payment_method: [
        "dinheiro",
        "cartao_credito",
        "cartao_debito",
        "pix",
        "transferencia",
        "cheque",
      ],
    },
  },
} as const
