export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      award_categories: {
        Row: {
          awards: Json | null
          cluster_title: string
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          image_path: string | null
          updated_at: string | null
        }
        Insert: {
          awards?: Json | null
          cluster_title: string
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          image_path?: string | null
          updated_at?: string | null
        }
        Update: {
          awards?: Json | null
          cluster_title?: string
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          image_path?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          message: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          message: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          message?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      nomination_documents: {
        Row: {
          file_name: string
          file_type: Database["public"]["Enums"]["document_type_enum"] | null
          id: string
          nomination_id: string
          storage_path: string
          uploaded_at: string
          user_id: string | null
        }
        Insert: {
          file_name: string
          file_type?: Database["public"]["Enums"]["document_type_enum"] | null
          id?: string
          nomination_id: string
          storage_path: string
          uploaded_at?: string
          user_id?: string | null
        }
        Update: {
          file_name?: string
          file_type?: Database["public"]["Enums"]["document_type_enum"] | null
          id?: string
          nomination_id?: string
          storage_path?: string
          uploaded_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nomination_documents_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
            referencedColumns: ["id"]
          },
        ]
      }
      nominations: {
        Row: {
          award_category_id: string | null
          created_at: string
          form_section_a: Json | null
          form_section_b: Json | null
          form_section_c_notes: string | null
          form_section_d: Json | null
          form_section_e: Json | null
          id: string
          nominator_email: string | null
          nominator_name: string | null
          nominee_name: string
          nominee_type: Database["public"]["Enums"]["nominee_type_enum"] | null
          status: Database["public"]["Enums"]["nomination_status_enum"] | null
          submitted_at: string | null
          summary_of_achievement: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          award_category_id?: string | null
          created_at?: string
          form_section_a?: Json | null
          form_section_b?: Json | null
          form_section_c_notes?: string | null
          form_section_d?: Json | null
          form_section_e?: Json | null
          id?: string
          nominator_email?: string | null
          nominator_name?: string | null
          nominee_name: string
          nominee_type?: Database["public"]["Enums"]["nominee_type_enum"] | null
          status?: Database["public"]["Enums"]["nomination_status_enum"] | null
          submitted_at?: string | null
          summary_of_achievement?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          award_category_id?: string | null
          created_at?: string
          form_section_a?: Json | null
          form_section_b?: Json | null
          form_section_c_notes?: string | null
          form_section_d?: Json | null
          form_section_e?: Json | null
          id?: string
          nominator_email?: string | null
          nominator_name?: string | null
          nominee_name?: string
          nominee_type?: Database["public"]["Enums"]["nominee_type_enum"] | null
          status?: Database["public"]["Enums"]["nomination_status_enum"] | null
          submitted_at?: string | null
          summary_of_achievement?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nominations_award_category_id_fkey"
            columns: ["award_category_id"]
            isOneToOne: false
            referencedRelation: "award_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_type_enum: "cv_resume" | "photo_media" | "additional_document"
      nomination_status_enum:
        | "draft"
        | "submitted"
        | "approved"
        | "rejected"
        | "incomplete"
      nominee_type_enum: "individual" | "organization" | "institution"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type_enum: ["cv_resume", "photo_media", "additional_document"],
      nomination_status_enum: [
        "draft",
        "submitted",
        "approved",
        "rejected",
        "incomplete",
      ],
      nominee_type_enum: ["individual", "organization", "institution"],
    },
  },
} as const
