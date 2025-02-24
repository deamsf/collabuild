export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          address: string
          description: string | null
          status: 'active' | 'completed' | 'on_hold'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          description?: string | null
          status?: 'active' | 'completed' | 'on_hold'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          description?: string | null
          status?: 'active' | 'completed' | 'on_hold'
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          status: 'to-do' | 'in-progress' | 'done'
          phase: string
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          status?: 'to-do' | 'in-progress' | 'done'
          phase: string
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          status?: 'to-do' | 'in-progress' | 'done'
          phase?: string
          due_date?: string | null
          created_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          project_id: string
          type: 'document' | 'photo' | 'financial'
          name: string
          size: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: 'document' | 'photo' | 'financial'
          name: string
          size: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: 'document' | 'photo' | 'financial'
          name?: string
          size?: string
          created_at?: string
        }
      }
      email_templates: {
        Row: {
          id: string
          project_id: string
          name: string
          subject: string
          description: string | null
          last_modified: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          subject: string
          description?: string | null
          last_modified?: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          subject?: string
          description?: string | null
          last_modified?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      project_status: 'active' | 'completed' | 'on_hold'
      task_status: 'to-do' | 'in-progress' | 'done'
      resource_type: 'document' | 'photo' | 'financial'
    }
  }
}