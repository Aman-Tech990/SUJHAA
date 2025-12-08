// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          app_name: "SUJHAA",
          slogan: "An Initiative By Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",

          // NAVBAR
          nav_about: "About",
          nav_pillars: "Pillars",
          nav_process: "Process",
          nav_login: "Login",
          nav_register: "Register",

          // HERO
          hero_categories_title: "Explore Schemes by",
          hero_categories_highlight: "Category",

          // PILLARS
          pillars_title: "Key Pillars of the Scheme",
          pillars_sub: "The core components driving change under PM-AJAY.",
          pillar_income_title: "Income Generation",
          pillar_income_desc:
            "Supporting sustainable livelihood projects and entrepreneurial ventures.",
          pillar_skill_title: "Skill Development",
          pillar_skill_desc:
            "Providing market-relevant training to enhance employability among youth.",
          pillar_infra_title: "Infrastructure",
          pillar_infra_desc:
            "Developing critical infrastructure in scheduled caste majority villages.",

          // CATEGORIES SECTION
          categories_title: "Explore Schemes by",
          categories_highlight: "Category",

          // PROCESS
          process_title: "Application Process Workflow",
          process_sub: "Simplified steps for grant-in-aid application.",
          step_1_title: "Registration",
          step_1_desc: "Register on the official portal with basic details.",
          step_2_title: "Proposal",
          step_2_desc: "Submit project proposals according to scheme guidelines.",
          step_3_title: "Evaluation",
          step_3_desc: "Committee reviews proposals for viability and impact.",
          step_4_title: "Grant Release",
          step_4_desc: "Funds released in installments upon approval.",

          // ABOUT
          about_title: "About SUJHAA",
          about_para:
            "SUJHAA is a digital platform designed to streamline the Grant-in-Aid component of PM-AJAY. We focus on automating beneficiary verification and ensuring transparency to accelerate project implementation for SC communities.",
          about_vision_heading: "Our Vision",
          about_vision_text:
            "To establish a seamless, transparent, and efficient digital ecosystem where every grant translates directly into measurable empowerment, ensuring that no eligible beneficiary is left behind due to administrative barriers.",
          about_watch_youtube: "Watch on YouTube",

          // FOOTER
          footer_title: "PM-AJAY",
          footer_quick_links: "Quick Links",
          footer_guidelines: "Scheme Guidelines",
          footer_faq: "FAQs",
          footer_contact: "Contact Us",
          footer_grievance: "Grievance Redressal",
          footer_note_title: "Important Note",
          footer_note_text:
            "This is a conceptual landing page designed for demonstration. For official information, please visit the respective Ministry website.",
          footer_rights: "Government of India. All rights reserved.",

          // LANGUAGE LABEL
          lang_label: "Language",

          // Beneficiary Dashboard
          welcome_back: "Welcome back",
          digital_id: "Digital ID",
          location: "Location",
          verified_beneficiary: "✔ Verified Beneficiary",
          pending_verification: "❌ Pending Verification",
          recommended_schemes: "Recommended Schemes",

          category_all: "All",
          category_income: "Income Generation",
          category_infra: "Infrastructure Support",
          category_skill: "Skill Development",

          search_schemes: "Search schemes...",

          apply_now: "Apply Now",
          read_more: "Read More",
          scheme_benefits: "Scheme Benefits",
          funding_amount: "Funding Amount",
          status: "Status",
          status_open: "Open",
          status_closed: "Closed",
          category: "Category",

          category_ALL: "All",
          category_INCOME_GENERATION: "Income Generation",
          category_INFRASTRUCTURE_SUPPORT: "Infrastructure Support",
          category_SKILL_DEVELOPMENT: "Skill Development"
        },
      },

      hi: {
        translation: {
          app_name: "सुज्हा",
          slogan:
            "प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना की पहल",

          nav_about: "परिचय",
          nav_pillars: "मुख्य स्तंभ",
          nav_process: "प्रक्रिया",
          nav_login: "लॉगिन",
          nav_register: "पंजीकरण",

          hero_categories_title: "योजनाएँ देखें",
          hero_categories_highlight: "श्रेणी के आधार पर",

          pillars_title: "योजना के मुख्य स्तंभ",
          pillars_sub:
            "पीएम-अजय के अंतर्गत परिवर्तन लाने वाले प्रमुख घटक।",
          pillar_income_title: "आय सृजन",
          pillar_income_desc:
            "टिकाऊ आजीविका परियोजनाओं और उद्यमिता को समर्थन।",
          pillar_skill_title: "कौशल विकास",
          pillar_skill_desc:
            "युवाओं की रोज़गार क्षमता बढ़ाने के लिए बाज़ार से जुड़ी प्रशिक्षण सुविधाएँ।",
          pillar_infra_title: "बुनियादी ढांचा",
          pillar_infra_desc:
            "अधिकांश अनुसूचित जाति बहुल गाँवों में आवश्यक बुनियादी ढांचा विकास।",

          categories_title: "योजनाएँ देखें",
          categories_highlight: "श्रेणी के आधार पर",

          process_title: "आवेदन प्रक्रिया कार्यप्रवाह",
          process_sub: "अनुदान-इन-एड आवेदन के सरल चरण।",
          step_1_title: "पंजीकरण",
          step_1_desc:
            "आधिकारिक पोर्टल पर मूल विवरण के साथ पंजीकरण करें।",
          step_2_title: "प्रस्ताव",
          step_2_desc:
            "योजना दिशानिर्देशों के अनुसार परियोजना प्रस्ताव जमा करें।",
          step_3_title: "मूल्यांकन",
          step_3_desc:
            "समिति द्वारा व्यवहार्यता और प्रभाव के आधार पर समीक्षा।",
          step_4_title: "अनुदान जारी",
          step_4_desc:
            "अनुमोदन के बाद किस्तों में धनराशि जारी।",

          about_title: "सुज्हा के बारे में",
          about_para:
            "सुज्हा एक डिजिटल प्लेटफ़ॉर्म है जो पीएम-अजय की अनुदान-इन-एड घटक को सुगम बनाने के लिए बनाया गया है। हमारा ध्यान लाभार्थी सत्यापन के स्वचालन और पारदर्शिता सुनिश्चित करने पर है ताकि एससी समुदायों के लिए परियोजना क्रियान्वयन तेज़ हो सके।",
          about_vision_heading: "हमारा विज़न",
          about_vision_text:
            "एक सहज, पारदर्शी और प्रभावी डिजिटल तंत्र स्थापित करना, जहाँ प्रत्येक अनुदान सीधे मापने योग्य सशक्तिकरण में बदल सके और कोई भी पात्र लाभार्थी प्रशासनिक बाधाओं के कारण पीछे न रह जाए।",
          about_watch_youtube: "यूट्यूब पर देखें",

          footer_title: "पीएम-अजय",
          footer_quick_links: "त्वरित लिंक",
          footer_guidelines: "योजना दिशानिर्देश",
          footer_faq: "सामान्य प्रश्न",
          footer_contact: "संपर्क करें",
          footer_grievance: "शिकायत निवारण",
          footer_note_title: "महत्वपूर्ण सूचना",
          footer_note_text:
            "यह एक प्रदर्शन के उद्देश्य से तैयार किया गया कॉन्सेप्ट पेज है। आधिकारिक जानकारी के लिए कृपया संबंधित मंत्रालय की वेबसाइट देखें।",
          footer_rights:
            "भारत सरकार। सर्वाधिकार सुरक्षित।",

          lang_label: "भाषा",

          welcome_back: "वापसी पर स्वागत है",
          digital_id: "डिजिटल आईडी",
          location: "स्थान",
          verified_beneficiary: "✔ सत्यापित लाभार्थी",
          pending_verification: "❌ सत्यापन लंबित",
          recommended_schemes: "अनुशंसित योजनाएँ",

          category_all: "सभी",
          category_income: "आय सृजन",
          category_infra: "बुनियादी ढांचा सहायता",
          category_skill: "कौशल विकास",

          search_schemes: "योजनाएँ खोजें...",
          apply_now: "आवेदन करें",
          read_more: "और पढ़ें",
          scheme_benefits: "योजना के लाभ",
          funding_amount: "अनुदान राशि",
          status: "स्थिति",
          status_open: "खुला है",
          status_closed: "बंद है",
          category: "श्रेणी",

          category_ALL: "सभी",
          category_INCOME_GENERATION: "आय सृजन",
          category_INFRASTRUCTURE_SUPPORT: "बुनियादी ढांचा समर्थन",
          category_SKILL_DEVELOPMENT: "कौशल विकास"
        },
      },

      od: {
        translation: {
          app_name: "ସୁଜ୍ଝା",
          slogan:
            "ପ୍ରଧାନମନ୍ତ୍ରୀ ଅନୁସୂଚିତ ଜାତି ଅଭ୍ୟୁଦୟ ଯୋଜନାର ପ୍ରୟାସ",

          nav_about: "ପରିଚୟ",
          nav_pillars: "ମୁଖ୍ୟ ଖମ୍ଭ",
          nav_process: "ପ୍ରକ୍ରିୟା",
          nav_login: "ଲଗଇନ୍",
          nav_register: "ରେଜିଷ୍ଟର",

          hero_categories_title: "ଯୋଜନାଗୁଡିକୁ ଦେଖନ୍ତୁ",
          hero_categories_highlight: "ଶ୍ରେଣୀ ଅନୁଯାୟୀ",

          pillars_title: "ଯୋଜନାର ମୁଖ୍ୟ ଖମ୍ଭ",
          pillars_sub:
            "PM-AJAY ଅଧୀନ ସମାଜିକ ପରିବର୍ତ୍ତନକୁ ଅଗ୍ରସର କରୁଥିବା ମୂଳ ଅଂଶଗୁଡିକ।",
          pillar_income_title: "ଆୟ ସୃଷ୍ଟି",
          pillar_income_desc:
            "ସ୍ଥାୟୀ ଜୀବିକା ପ୍ରକଳ୍ପ ଏବଂ ଉଦ୍ୟମୀତ୍ୱକୁ ସମର୍ଥନ।",
          pillar_skill_title: "କୌଶଳ ବିକାଶ",
          pillar_skill_desc:
            "ଯୁବକ-ଯୁବତୀଙ୍କର ରୋଜଗାର ସମ୍ଭାବନା ବଢ଼ାଇବା ପାଇଁ ବଜାରମୁଖୀ ପ୍ରଶିକ୍ଷଣ।",
          pillar_infra_title: "ଢାଞ୍ଚାଗତ ବିକାଶ",
          pillar_infra_desc:
            "SC ବହୁଳ ଗ୍ରାମମାନଙ୍କରେ ଆବଶ୍ୟକିୟ ଢାଞ୍ଚାଗତ ବିକାଶ।",

          categories_title: "ଯୋଜନାଗୁଡିକୁ ଦେଖନ୍ତୁ",
          categories_highlight: "ଶ୍ରେଣୀ ଅନୁଯାୟୀ",

          process_title: "ଆବେଦନ ପ୍ରକ୍ରିୟା ପ୍ରବାହ",
          process_sub:
            "Grant-in-Aid ଆବେଦନ ପାଇଁ ସହଜ ପଦକ୍ରମ।",
          step_1_title: "ନିବନ୍ଧନ",
          step_1_desc:
            "ଆଧିକାରିକ ପୋର୍ଟାଲରେ ସରଳ ବିବରଣୀ ସହିତ ନିବନ୍ଧନ କରନ୍ତୁ।",
          step_2_title: "ପ୍ରସ୍ତାବ",
          step_2_desc:
            "ଯୋଜନା ନିୟମାବଳୀ ଅନୁସାରେ ପ୍ରକଳ୍ପ ପ୍ରସ୍ତାବ ଜମା କରନ୍ତୁ।",
          step_3_title: "ମୂଲ୍ୟାୟନ",
          step_3_desc:
            "କମିଟି ଦ୍ୱାରା ପ୍ରକଳ୍ପର ବ୍ୟବହାରିକତା ଏବଂ ପ୍ରଭାବ ବିଷୟରେ ସମୀକ୍ଷା।",
          step_4_title: "ଅନୁଦାନ ମୁକ୍ତି",
          step_4_desc:
            "ମଞ୍ଜୁରୀ ମିଳିଲେ କିଷ୍ଟିରେ ଧନରାଶି ମୁକ୍ତି।",

          about_title: "ସୁଜ୍ଝା ସମ୍ବନ୍ଧିତ",
          about_para:
            "ସୁଜ୍ଝା ହେଉଛି PM-AJAY ର Grant-in-Aid ଅଂଶକୁ ସରଳ କରିବା ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଥିବା ଏକ ଡିଜିଟାଲ ପ୍ଲାଟଫର୍ମ। ଆମର ଲକ୍ଷ୍ୟ ହେଉଛି ଲାଭାର୍ଥୀ ସତ୍ୟପାୟନରେ ସ୍ୱୟଂଚାଳନ ଆଣିବା ଏବଂ ପାରଦର୍ଶିତା ବଢ଼ାଇ SC ସମୁଦାୟ ପାଇଁ ପ୍ରକଳ୍ପ କାର୍ଯ୍ୟାନ୍ବୟନକୁ ତ୍ୱରାନ୍ୱିତ କରିବା।",
          about_vision_heading: "ଆମର ଦୃଷ୍ଟିଭଙ୍ଗୀ",
          about_vision_text:
            "ଏକ ସମ୍ପୂର୍ଣ୍ଣ ସହଜ, ପାରଦର୍ଶୀ ଏବଂ କାର୍ଯ୍ୟକ୍ଷମ ଡିଜିଟାଲ ପ୍ରଣାଳୀ ସ୍ଥାପନା କରିବା, ଯେଉଁଠାରେ ପ୍ରତ୍ୟେକ ଅନୁଦାନ ସିଧାସଳଖ ସଶକ୍ତିକରଣରେ ପରିଣତି ହେବ ଏବଂ କୌଣସି ଯୋଗ୍ୟ ଲାଭାର୍ଥୀ ପ୍ରଶାସନିକ ବାଧା କାରଣରୁ ଛାଡ଼ି ନଯିବେ।",
          about_watch_youtube: "ୟୁଟ୍ୟୁବରେ ଦେଖନ୍ତୁ",

          footer_title: "PM-AJAY",
          footer_quick_links: "ଦ୍ରୁତ ଲିଙ୍କ୍",
          footer_guidelines: "ଯୋଜନା ନିୟମାବଳୀ",
          footer_faq: "ପ୍ରଶ୍ନୋତ୍ତର",
          footer_contact: "ଯୋଗାଯୋଗ",
          footer_grievance: "ଅଭିଯୋଗ ନିବାରଣ",
          footer_note_title: "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସୂଚନା",
          footer_note_text:
            "ଏହା ଏକ ଡେମୋ ପାଇଁ ତିଆରି କରାଯାଇଥିବା ଧାରଣାତ୍ମକ ପୃଷ୍ଠା। ଆଧିକାରିକ ସୂଚନା ପାଇଁ ଦୟାକରି ସମ୍ପର୍କିତ ମନ୍ତ୍ରାଳୟର ୱେବସାଇଟକୁ ଭ୍ରମଣ କରନ୍ତୁ।",
          footer_rights:
            "ଭାରତ ସରକାର। ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।",

          lang_label: "ଭାଷା",

          welcome_back: "ପୁନର୍ବାର ସ୍ବାଗତ",
          digital_id: "ଡିଜିଟାଲ୍ ID",
          location: "ଅବସ୍ଥାନ",
          verified_beneficiary: "✔ ସତ୍ୟାପିତ ଲାଭାର୍ଥୀ",
          pending_verification: "❌ ସତ୍ୟାପନ ଅପେକ୍ଷାରତ",
          recommended_schemes: "ସୁପରିଶ୍ରୁତ ଯୋଜନାଗୁଡିକ",

          category_all: "ସମସ୍ତ",
          category_income: "ଆୟ ସୃଷ୍ଟି",
          category_infra: "ଢାଞ୍ଚାଗତ ସହଯୋଗ",
          category_skill: "କୌଶଳ ବିକାଶ",

          search_schemes: "ଯୋଜନା ଖୋଜନ୍ତୁ...",
          apply_now: "ଆବେଦନ କରନ୍ତୁ",
          read_more: "ଅଧିକ ପଢନ୍ତୁ",
          scheme_benefits: "ଯୋଜନାର ଲାଭ",
          funding_amount: "ଆର୍ଥିକ ସହାୟତା",
          status: "ସ୍ଥିତି",
          status_open: "ଖୋଲା",
          status_closed: "ବନ୍ଦ",
          category: "ଶ୍ରେଣୀ",

          category_ALL: "ସମସ୍ତ",
          category_INCOME_GENERATION: "ଆୟ ସୃଷ୍ଟି",
          category_INFRASTRUCTURE_SUPPORT: "ଢାଞ୍ଚାଗତ ସହଯୋଗ",
          category_SKILL_DEVELOPMENT: "ଦକ୍ଷତା ବିକାଶ"
        },
      },
    },
  });

export default i18n;
