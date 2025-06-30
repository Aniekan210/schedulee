// test-supabase.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://nvmjfvxaehroofhpyzfg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bWpmdnhhZWhyb29maHB5emZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMjE2NzksImV4cCI6MjA2Njc5NzY3OX0.JywF9KCWJqymuL5tTqzYBQKF9QQdg6702MBroXwjw50"
);

async function run() {
  console.time("supabase");
  const { data, error } = await supabase.auth.getSession();
  console.timeEnd("supabase");

  if (error) console.error(error);
  else console.log(data);
}

run();
