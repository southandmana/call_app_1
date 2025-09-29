import { supabase } from './client';

export async function testConnection() {
  try {
    // Test connection by checking if we can query (without requiring tables to exist)
    const { error } = await supabase
      .from('sessions')
      .select('count')
      .limit(1);

    // If the table doesn't exist, we'll get a specific error
    if (error) {
      if (error.message && error.message.includes('relation "public.sessions" does not exist')) {
        console.log('⚠️ Database connected but tables not set up yet');
        console.log('Run the schema.sql file in your Supabase dashboard to create tables');
        return false;
      }

      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}