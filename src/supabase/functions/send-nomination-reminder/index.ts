@@ .. @@
     for (const nomination of nominationsToRemind) {
       try {
       }
     }
-        // Get nominator email from form_section_d or fallback to nominator_email
-        const sectionD = nomination.form_section_d as any;
-        const nominatorEmail = sectionD?.nominator_email || nomination.nominator_email;
-        const nominatorName = sectionD?.nominator_full_name || nomination.nominator_name || 'Nominator';
+        // Get nominator email from form_section_a (collected early) or fallback to form_section_d or top-level
+        const sectionA = nomination.form_section_a as any;
+        const sectionD = nomination.form_section_d as any;
+        const nominatorEmail = sectionA?.nominator_email || sectionD?.nominator_email || nomination.nominator_email;
+        const nominatorName = sectionA?.nominator_name || sectionD?.nominator_full_name || nomination.nominator_name || 'Nominator';
         
         if (!nominatorEmail) {
         }