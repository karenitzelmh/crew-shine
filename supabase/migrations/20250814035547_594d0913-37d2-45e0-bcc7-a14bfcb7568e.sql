-- Add missing id column to employees table
ALTER TABLE public.employees ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;