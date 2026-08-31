@@ -38,14 +38,13 @@
       // Save to Supabase
       const { data, error } = await supabase
         .from('roadmaps')
-        .insert([
+        .insert(
           {
             topic,
             data: mockRoadmap,
-            user_id: 'user_id', // TODO: Get from Clerk
-          },
-        ])
-        .select();
+            user_id: (await supabase.auth.getUser()).data.user?.id,
+          }
+        );
 
       if (error) throw error;