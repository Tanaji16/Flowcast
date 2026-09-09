export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'attendee' | 'organizer';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'attendee' | 'organizer';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'attendee' | 'organizer';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'attendee' | 'organizer';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'attendee' | 'organizer';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'attendee' | 'organizer';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      venues: {
        Row: {
          id: string;
          name: string;
          location: string;
          lat: number | null;
          lng: number | null;
          total_capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          lat?: number | null;
          lng?: number | null;
          total_capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          lat?: number | null;
          lng?: number | null;
          total_capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      zones: {
        Row: {
          id: string;
          venue_id: string;
          name: string;
          lat: number;
          lng: number;
          max_capacity: number;
          current_occupancy: number;
          occupancy_percent: number;
          status: 'green' | 'amber' | 'red' | 'low' | 'moderate' | 'critical';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          venue_id: string;
          name: string;
          lat: number;
          lng: number;
          max_capacity?: number;
          current_occupancy?: number;
          occupancy_percent?: number;
          status?: 'green' | 'amber' | 'red' | 'low' | 'moderate' | 'critical';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          venue_id?: string;
          name?: string;
          lat?: number;
          lng?: number;
          max_capacity?: number;
          current_occupancy?: number;
          occupancy_percent?: number;
          status?: 'green' | 'amber' | 'red' | 'low' | 'moderate' | 'critical';
          updated_at?: string;
        };
      };
      hotels: {
        Row: {
          id: string;
          name: string;
          address: string;
          lat: number | null;
          lng: number | null;
          total_rooms: number;
          available_rooms: number;
          price_per_night: number;
          rating: number | null;
          contact_info: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          lat?: number | null;
          lng?: number | null;
          total_rooms?: number;
          available_rooms?: number;
          price_per_night?: number;
          rating?: number | null;
          contact_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          lat?: number | null;
          lng?: number | null;
          total_rooms?: number;
          available_rooms?: number;
          price_per_night?: number;
          rating?: number | null;
          contact_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      accommodations: {
        Row: {
          id: string;
          name: string;
          address: string;
          total_rooms: number;
          available_rooms: number;
          contact_info: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          total_rooms?: number;
          available_rooms?: number;
          contact_info?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          total_rooms?: number;
          available_rooms?: number;
          contact_info?: string | null;
          created_at?: string;
        };
      };
      transport_routes: {
        Row: {
          id: string;
          route_name: string;
          start_point: string;
          end_point: string;
          frequency_minutes: number;
          status: 'normal' | 'delayed' | 'congested';
          current_delay_minutes: number;
          capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          route_name: string;
          start_point: string;
          end_point: string;
          frequency_minutes?: number;
          status?: 'normal' | 'delayed' | 'congested';
          current_delay_minutes?: number;
          capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          route_name?: string;
          start_point?: string;
          end_point?: string;
          frequency_minutes?: number;
          status?: 'normal' | 'delayed' | 'congested';
          current_delay_minutes?: number;
          capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          item_type: 'hotel' | 'accommodation' | 'transport' | 'session' | 'venue';
          item_id: string;
          status: 'confirmed' | 'cancelled' | 'pending';
          details: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: 'hotel' | 'accommodation' | 'transport' | 'session' | 'venue';
          item_id: string;
          status?: 'confirmed' | 'cancelled' | 'pending';
          details?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: 'hotel' | 'accommodation' | 'transport' | 'session' | 'venue';
          item_id?: string;
          status?: 'confirmed' | 'cancelled' | 'pending';
          details?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          message: string;
          severity: 'info' | 'warning' | 'critical';
          zone_id: string | null;
          resolved: boolean;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          title?: string;
          message: string;
          severity?: 'info' | 'warning' | 'critical';
          zone_id?: string | null;
          resolved?: boolean;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          severity?: 'info' | 'warning' | 'critical';
          zone_id?: string | null;
          resolved?: boolean;
          created_at?: string;
          resolved_at?: string | null;
        };
      };
      suggestions: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string;
          original_zone_id: string;
          alternative_zone_id: string | null;
          incentive: string | null;
          estimated_wait_difference_minutes: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description: string;
          original_zone_id: string;
          alternative_zone_id?: string | null;
          incentive?: string | null;
          estimated_wait_difference_minutes?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          description?: string;
          original_zone_id?: string;
          alternative_zone_id?: string | null;
          incentive?: string | null;
          estimated_wait_difference_minutes?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          user_id: string;
          zone_id: string;
          congestion_rating: number | null;
          comments: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          zone_id: string;
          congestion_rating?: number | null;
          comments?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          zone_id?: string;
          congestion_rating?: number | null;
          comments?: string | null;
          created_at?: string;
        };
      };
      attendee_feedback: {
        Row: {
          id: string;
          user_id: string;
          zone_id: string;
          congestion_rating: number | null;
          comments: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          zone_id: string;
          congestion_rating?: number | null;
          comments?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          zone_id?: string;
          congestion_rating?: number | null;
          comments?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

