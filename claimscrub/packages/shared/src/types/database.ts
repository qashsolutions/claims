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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      AuditLog: {
        Row: {
          action: Database["public"]["Enums"]["AuditAction"]
          createdAt: string
          id: string
          ipAddress: string
          metadata: Json | null
          resource: string
          resourceId: string
          userAgent: string | null
          userId: string
        }
        Insert: {
          action: Database["public"]["Enums"]["AuditAction"]
          createdAt?: string
          id: string
          ipAddress: string
          metadata?: Json | null
          resource: string
          resourceId: string
          userAgent?: string | null
          userId: string
        }
        Update: {
          action?: Database["public"]["Enums"]["AuditAction"]
          createdAt?: string
          id?: string
          ipAddress?: string
          metadata?: Json | null
          resource?: string
          resourceId?: string
          userAgent?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "AuditLog_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Claim: {
        Row: {
          claimNumber: string
          createdAt: string
          createdById: string
          dateOfService: string
          id: string
          insuranceId: string
          patientDob: string
          patientGender: string
          patientName: string
          payerId: string | null
          payerName: string
          placeOfService: string
          practiceId: string
          priorAuthNumber: string | null
          providerName: string
          providerNpi: string
          score: number | null
          status: Database["public"]["Enums"]["ClaimStatus"]
          submittedAt: string | null
          totalCharge: number
          updatedAt: string
        }
        Insert: {
          claimNumber: string
          createdAt?: string
          createdById: string
          dateOfService: string
          id: string
          insuranceId: string
          patientDob: string
          patientGender: string
          patientName: string
          payerId?: string | null
          payerName: string
          placeOfService: string
          practiceId: string
          priorAuthNumber?: string | null
          providerName: string
          providerNpi: string
          score?: number | null
          status?: Database["public"]["Enums"]["ClaimStatus"]
          submittedAt?: string | null
          totalCharge: number
          updatedAt: string
        }
        Update: {
          claimNumber?: string
          createdAt?: string
          createdById?: string
          dateOfService?: string
          id?: string
          insuranceId?: string
          patientDob?: string
          patientGender?: string
          patientName?: string
          payerId?: string | null
          payerName?: string
          placeOfService?: string
          practiceId?: string
          priorAuthNumber?: string | null
          providerName?: string
          providerNpi?: string
          score?: number | null
          status?: Database["public"]["Enums"]["ClaimStatus"]
          submittedAt?: string | null
          totalCharge?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Claim_createdById_fkey"
            columns: ["createdById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Claim_practiceId_fkey"
            columns: ["practiceId"]
            isOneToOne: false
            referencedRelation: "Practice"
            referencedColumns: ["id"]
          },
        ]
      }
      Practice: {
        Row: {
          address: Json | null
          createdAt: string
          epicConnected: boolean
          epicOrgId: string | null
          id: string
          name: string
          npi: string
          specialty: Database["public"]["Enums"]["Specialty"]
          subscriptionId: string | null
          taxId: string | null
          updatedAt: string
        }
        Insert: {
          address?: Json | null
          createdAt?: string
          epicConnected?: boolean
          epicOrgId?: string | null
          id: string
          name: string
          npi: string
          specialty: Database["public"]["Enums"]["Specialty"]
          subscriptionId?: string | null
          taxId?: string | null
          updatedAt: string
        }
        Update: {
          address?: Json | null
          createdAt?: string
          epicConnected?: boolean
          epicOrgId?: string | null
          id?: string
          name?: string
          npi?: string
          specialty?: Database["public"]["Enums"]["Specialty"]
          subscriptionId?: string | null
          taxId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Practice_subscriptionId_fkey"
            columns: ["subscriptionId"]
            isOneToOne: true
            referencedRelation: "Subscription"
            referencedColumns: ["id"]
          },
        ]
      }
      RateLimit: {
        Row: {
          count: number
          id: string
          resetAt: string
        }
        Insert: {
          count?: number
          id: string
          resetAt: string
        }
        Update: {
          count?: number
          id?: string
          resetAt?: string
        }
        Relationships: []
      }
      ServiceLine: {
        Row: {
          charge: number
          claimId: string
          cptCode: string
          cptDescription: string | null
          createdAt: string
          drugCode: string | null
          drugUnits: number | null
          icdCodes: string[] | null
          id: string
          lineNumber: number
          modifiers: string[] | null
          units: number
        }
        Insert: {
          charge: number
          claimId: string
          cptCode: string
          cptDescription?: string | null
          createdAt?: string
          drugCode?: string | null
          drugUnits?: number | null
          icdCodes?: string[] | null
          id: string
          lineNumber: number
          modifiers?: string[] | null
          units?: number
        }
        Update: {
          charge?: number
          claimId?: string
          cptCode?: string
          cptDescription?: string | null
          createdAt?: string
          drugCode?: string | null
          drugUnits?: number | null
          icdCodes?: string[] | null
          id?: string
          lineNumber?: number
          modifiers?: string[] | null
          units?: number
        }
        Relationships: [
          {
            foreignKeyName: "ServiceLine_claimId_fkey"
            columns: ["claimId"]
            isOneToOne: false
            referencedRelation: "Claim"
            referencedColumns: ["id"]
          },
        ]
      }
      Subscription: {
        Row: {
          claimsThisPeriod: number
          createdAt: string
          currentPeriodEnd: string | null
          currentPeriodStart: string | null
          id: string
          plan: Database["public"]["Enums"]["PlanType"]
          status: Database["public"]["Enums"]["SubStatus"]
          stripeCustomerId: string
          stripeSubscriptionId: string | null
          updatedAt: string
        }
        Insert: {
          claimsThisPeriod?: number
          createdAt?: string
          currentPeriodEnd?: string | null
          currentPeriodStart?: string | null
          id: string
          plan: Database["public"]["Enums"]["PlanType"]
          status: Database["public"]["Enums"]["SubStatus"]
          stripeCustomerId: string
          stripeSubscriptionId?: string | null
          updatedAt: string
        }
        Update: {
          claimsThisPeriod?: number
          createdAt?: string
          currentPeriodEnd?: string | null
          currentPeriodStart?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["PlanType"]
          status?: Database["public"]["Enums"]["SubStatus"]
          stripeCustomerId?: string
          stripeSubscriptionId?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      UsageRecord: {
        Row: {
          claimId: string
          createdAt: string
          id: string
          sizeBytes: number
          subscriptionId: string
          userId: string
        }
        Insert: {
          claimId: string
          createdAt?: string
          id?: string
          sizeBytes: number
          subscriptionId: string
          userId: string
        }
        Update: {
          claimId?: string
          createdAt?: string
          id?: string
          sizeBytes?: number
          subscriptionId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UsageRecord_subscriptionId_fkey"
            columns: ["subscriptionId"]
            isOneToOne: false
            referencedRelation: "Subscription"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UsageRecord_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          epicTokens: Json | null
          epicUserId: string | null
          id: string
          lastLoginAt: string | null
          mfaEnabled: boolean
          mfaSecret: string | null
          passwordHash: string | null
          practiceId: string
          role: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          epicTokens?: Json | null
          epicUserId?: string | null
          id: string
          lastLoginAt?: string | null
          mfaEnabled?: boolean
          mfaSecret?: string | null
          passwordHash?: string | null
          practiceId: string
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          epicTokens?: Json | null
          epicUserId?: string | null
          id?: string
          lastLoginAt?: string | null
          mfaEnabled?: boolean
          mfaSecret?: string | null
          passwordHash?: string | null
          practiceId?: string
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_practiceId_fkey"
            columns: ["practiceId"]
            isOneToOne: false
            referencedRelation: "Practice"
            referencedColumns: ["id"]
          },
        ]
      }
      Validation: {
        Row: {
          checkType: Database["public"]["Enums"]["ValidationCheck"]
          claimId: string
          createdAt: string
          denialCode: string | null
          id: string
          message: string
          metadata: Json | null
          status: Database["public"]["Enums"]["ValidationStatus"]
          suggestion: string | null
        }
        Insert: {
          checkType: Database["public"]["Enums"]["ValidationCheck"]
          claimId: string
          createdAt?: string
          denialCode?: string | null
          id: string
          message: string
          metadata?: Json | null
          status: Database["public"]["Enums"]["ValidationStatus"]
          suggestion?: string | null
        }
        Update: {
          checkType?: Database["public"]["Enums"]["ValidationCheck"]
          claimId?: string
          createdAt?: string
          denialCode?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["ValidationStatus"]
          suggestion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Validation_claimId_fkey"
            columns: ["claimId"]
            isOneToOne: false
            referencedRelation: "Claim"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      get_current_practice_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      AuditAction:
        | "LOGIN"
        | "LOGOUT"
        | "VIEW_CLAIM"
        | "CREATE_CLAIM"
        | "UPDATE_CLAIM"
        | "DELETE_CLAIM"
        | "SUBMIT_CLAIM"
        | "VIEW_PATIENT"
        | "EXPORT_DATA"
        | "CHANGE_SETTINGS"
      ClaimStatus:
        | "DRAFT"
        | "VALIDATING"
        | "VALIDATED"
        | "SUBMITTED"
        | "ACCEPTED"
        | "PAID"
        | "DENIED"
        | "APPEALING"
      PlanType:
        | "FREE_TRIAL"
        | "PAY_PER_CLAIM"
        | "UNLIMITED_MONTHLY"
        | "UNLIMITED_ANNUAL"
      Specialty: "ONCOLOGY" | "MENTAL_HEALTH" | "OBGYN" | "ENDOCRINOLOGY"
      SubStatus: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "UNPAID"
      UserRole: "PROVIDER" | "BILLING_STAFF" | "ADMIN"
      ValidationCheck:
        | "CPT_ICD_MATCH"
        | "NPI_VERIFY"
        | "MODIFIER_CHECK"
        | "PRIOR_AUTH"
        | "DATA_COMPLETENESS"
        | "TIMELY_FILING"
        | "NCCI_EDITS"
      ValidationStatus: "PASS" | "WARNING" | "FAIL"
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
      AuditAction: [
        "LOGIN",
        "LOGOUT",
        "VIEW_CLAIM",
        "CREATE_CLAIM",
        "UPDATE_CLAIM",
        "DELETE_CLAIM",
        "SUBMIT_CLAIM",
        "VIEW_PATIENT",
        "EXPORT_DATA",
        "CHANGE_SETTINGS",
      ],
      ClaimStatus: [
        "DRAFT",
        "VALIDATING",
        "VALIDATED",
        "SUBMITTED",
        "ACCEPTED",
        "PAID",
        "DENIED",
        "APPEALING",
      ],
      PlanType: [
        "FREE_TRIAL",
        "PAY_PER_CLAIM",
        "UNLIMITED_MONTHLY",
        "UNLIMITED_ANNUAL",
      ],
      Specialty: ["ONCOLOGY", "MENTAL_HEALTH", "OBGYN", "ENDOCRINOLOGY"],
      SubStatus: ["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED", "UNPAID"],
      UserRole: ["PROVIDER", "BILLING_STAFF", "ADMIN"],
      ValidationCheck: [
        "CPT_ICD_MATCH",
        "NPI_VERIFY",
        "MODIFIER_CHECK",
        "PRIOR_AUTH",
        "DATA_COMPLETENESS",
        "TIMELY_FILING",
        "NCCI_EDITS",
      ],
      ValidationStatus: ["PASS", "WARNING", "FAIL"],
    },
  },
} as const
