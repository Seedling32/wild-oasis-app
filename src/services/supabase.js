import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nszconnulcxeumymdjzr.supabase.co';

const supabaseKey = 'sb_publishable_fMrDiyzeuflJf_REw_Q94w_TCjLIIMn';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
