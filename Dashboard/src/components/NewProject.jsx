import React, { useState } from "react";
import { 
  Sparkles, FileText, Wallet, GraduationCap, FolderOpen, LayoutDashboard, User, Hash, Phone, Mail,
  BookText, Building, Info, Landmark, Banknote, UploadCloud, CheckCircle, ArrowLeft, LoaderCircle, ShieldCheck
} from "lucide-react";

// Helper component for form steps
const Step = ({ number, title, active }) => (
  <div className="flex items-center">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${active ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
      {number}
    </div>
    <div className="ml-4">
      <h3 className={`font-semibold ${active ? 'text-orange-600' : 'text-gray-600'}`}>{title}</h3>
      <p className="text-sm text-gray-400">Please fill the details</p>
    </div>
  </div>
);

// Helper for input fields with icons
const IconInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <input 
      {...props}
      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
    />
  </div>
);

const IconSelect = ({ icon: Icon, children, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <select 
      {...props}
      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition appearance-none"
    >
        {children}
    </select>
  </div>
);

// File upload component
const FileUploadItem = ({ doc, file, onUpload }) => (
    <div className={`p-4 rounded-lg border-2 flex items-center justify-between ${file ? 'border-green-500 bg-green-50' : 'border-dashed border-gray-300 bg-white'}`}>
        <div>
            <p className={`font-semibold ${file ? 'text-green-800' : 'text-gray-700'}`}>{doc.label}</p>
            {file ? (
                <div className="flex items-center space-x-2 text-sm text-green-700 mt-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{file.name}</span>
                </div>
            ) : (
                <p className="text-xs text-gray-500">Supports: PDF, JPG, PNG</p>
            )}
        </div>
        <label htmlFor={doc.id} className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm flex items-center space-x-2">
            <UploadCloud className="w-4 h-4" />
            <span>{file ? 'Change' : 'Upload'}</span>
        </label>
        <input
            id={doc.id}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => onUpload(e, doc.id)}
            required
            className="hidden"
        />
    </div>
);


function NewProject() {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    applicantType: "", name: "", aadhaar: "", mobile: "", email: "",
    projectTitle: "", projectType: "", description: "", district: "Bhubaneswar", block: "",
    totalCost: "", govtShare: "", accountNumber: "", ifsc: "",
    documents: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [apiError, setApiError] = useState('');

  const steps = [
    { number: 1, title: 'Applicant Details' },
    { number: 2, title: 'Project Details' },
    { number: 3, title: 'Financials & Bank Info' },
    { number: 4, title: 'Document Upload' },
  ];

  const requiredDocs = [
    { id: "aadhaar", label: "Aadhaar Card" },
    { id: "bankPassbook", label: "Bank Passbook (Front Page)" },
    { id: "projectProposal", label: "Detailed Project Proposal (PDF)" },
    { id: "landOwnership", label: "Land Ownership / Lease Document" },
    { id: "quotation", label: "Quotation / Estimate for Project Cost" },
  ];

  const callGeminiAPI = async (prompt) => {
    setApiError('');
    const apiKey = ""; // API key will be injected by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
          throw new Error("Failed to generate content. Please try again.");
      }
      return text;

    } catch (error) {
      console.error("Gemini API call failed:", error);
      setApiError(error.message);
      return null;
    }
  };

  const handleGenerateIdeas = async () => {
    if (!formData.applicantType) {
        setApiError("Please select an applicant type first.");
        return;
    }
    setGeneratingIdeas(true);
    setProjectIdeas([]);
    const prompt = `Based on the PM-AJAY scheme for Scheduled Caste beneficiaries in Bhubaneswar, Odisha, suggest 3 innovative project ideas for a "${formData.applicantType}". For each idea, provide a catchy title and a one-sentence description. Format the output as a JSON array of objects, where each object has a "title" and "description" key. Example: [{"title": "Example Title", "description": "Example description."}]`;
    
    const result = await callGeminiAPI(prompt);
    if (result) {
        try {
            // Clean the result to ensure it's valid JSON
            const cleanedResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
            const ideas = JSON.parse(cleanedResult);
            setProjectIdeas(ideas);
        } catch (e) {
            console.error("Failed to parse project ideas JSON:", e);
            setApiError("Received an invalid format from the AI. Please try again.");
        }
    }
    setGeneratingIdeas(false);
  };
  
  const handleGenerateDescription = async () => {
    if (!formData.projectTitle || !formData.projectType) {
        setApiError("Please provide a Project Title and Project Type first.");
        return;
    }
    setGeneratingDescription(true);
    const prompt = `Write a detailed and compelling project description for a Grant-in-Aid application under the PM-AJAY scheme. The project is titled "${formData.projectTitle}" and is a "${formData.projectType}" type project. The description should be around 100-150 words and highlight the project's objectives, target beneficiaries, and expected positive impact on the community in Bhubaneswar, Odisha.`;
    
    const result = await callGeminiAPI(prompt);
    if (result) {
        setFormData(prev => ({ ...prev, description: result }));
    }
    setGeneratingDescription(false);
  };


  const handleFileUpload = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        documents: { ...formData.documents, [id]: file },
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleNext = () => setActiveStep(prev => Math.min(prev + 1, steps.length));
  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 1));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
    }, 2000); 
  };
  
  if (isSubmitted) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse"/>
                  <h2 className="text-2xl font-bold text-gray-800 mt-6">Application Submitted!</h2>
                  <p className="text-gray-600 mt-2">Your project application has been sent for review. You can track its status in 'My Applications'.</p>
                  <p className="text-sm text-gray-500 mt-4">Reference ID: <span className="font-semibold text-gray-700">PMAJAY202510345</span></p>
                  <button onClick={() => window.location.reload()} className="mt-8 w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                      Back to Dashboard
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-orange-50/50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Apply for a New Project</h1>
        <p className="text-gray-500 mb-8">Follow the steps below to complete your application under the Grant-in-Aid scheme.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Content */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md">
            {/* Stepper */}
            <div className="flex justify-between items-start mb-8 border-b pb-6">
                {steps.map(step => <Step key={step.number} {...step} active={activeStep === step.number} />)}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Applicant Details */}
              <div className={activeStep !== 1 ? 'hidden' : 'block'}>
                 <h3 className="text-xl font-semibold text-orange-600 mb-6">1. Applicant Details</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    <IconSelect name="applicantType" onChange={handleChange} value={formData.applicantType} icon={Building} required>
                       <option value="">Select Applicant Type</option>
                       <option value="individual">Individual</option>
                       <option value="ngo">NGO / Trust</option>
                       <option value="shg">Self Help Group (SHG)</option>
                    </IconSelect>
                    <IconInput type="text" name="name" placeholder="Full Name / Organization Name" onChange={handleChange} value={formData.name} icon={User} required />
                    <IconInput type="text" name="aadhaar" placeholder="Aadhaar / Registration No." onChange={handleChange} value={formData.aadhaar} icon={Hash} required />
                    <IconInput type="tel" name="mobile" placeholder="10-digit Mobile Number" onChange={handleChange} value={formData.mobile} icon={Phone} required />
                    <div className="md:col-span-2">
                        <IconInput type="email" name="email" placeholder="Email ID" onChange={handleChange} value={formData.email} icon={Mail} required/>
                    </div>
                 </div>
              </div>
              
              {/* Step 2: Project Details */}
              <div className={activeStep !== 2 ? 'hidden' : 'block'}>
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-orange-600">2. Project Details</h3>
                 </div>
                 
                

                 
                 {projectIdeas.length > 0 && (
                     <div className="space-y-3 mb-6 p-4 bg-orange-50 rounded-lg">
                         <h4 className="font-semibold text-gray-700">Here are some ideas for you:</h4>
                         {projectIdeas.map((idea, index) => (
                             <div key={index} className="p-3 border rounded-md hover:bg-white cursor-pointer" onClick={() => setFormData(prev => ({...prev, projectTitle: idea.title, description: idea.description}))}>
                                 <p className="font-bold text-orange-800">{idea.title}</p>
                                 <p className="text-sm text-gray-600">{idea.description}</p>
                             </div>
                         ))}
                     </div>
                 )}

                 <div className="grid md:grid-cols-2 gap-6">
                    <IconInput type="text" name="projectTitle" placeholder="Project Title" onChange={handleChange} value={formData.projectTitle} icon={BookText} required/>
                    <IconSelect name="projectType" onChange={handleChange} value={formData.projectType} icon={Landmark} required>
                       <option value="">Select Project Type</option>
                       <option value="skill">Skill Development</option>
                       <option value="income">Income Generation</option>
                       <option value="infrastructure">Infrastructure Support</option>
                    </IconSelect>
                    <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-gray-600 font-medium">Project Description</label>
                        </div>
                        <textarea name="description" placeholder="Briefly describe your project goals and impact..." onChange={handleChange} value={formData.description} className="w-full border border-gray-300 rounded-lg p-3 h-28 focus:ring-2 focus:ring-orange-400" required/>
                    </div>
                    <IconInput type="text" name="district" onChange={handleChange} value={formData.district} icon={Info} readOnly className="bg-gray-100"/>
                    <IconInput type="text" name="block" placeholder="Block / Municipality" onChange={handleChange} value={formData.block} icon={Info} required/>
                 </div>
              </div>

              {/* Step 3: Financial Details */}
              <div className={activeStep !== 3 ? 'hidden' : 'block'}>
                  <h3 className="text-xl font-semibold text-orange-600 mb-6">3. Financial & Bank Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                      <IconInput type="number" name="totalCost" placeholder="Total Project Cost (₹)" onChange={handleChange} value={formData.totalCost} icon={Banknote} required />
                      <IconInput type="number" name="govtShare" placeholder="Govt. Share Requested (₹)" onChange={handleChange} value={formData.govtShare} icon={Banknote} required />
                      <IconInput type="text" name="accountNumber" placeholder="Bank Account Number" onChange={handleChange} value={formData.accountNumber} icon={Hash} required />
                      <IconInput type="text" name="ifsc" placeholder="IFSC Code" onChange={handleChange} value={formData.ifsc} icon={Hash} required />
                  </div>
              </div>

              {/* Step 4: Documents */}
              <div className={activeStep !== 4 ? 'hidden' : 'block'}>
                  <h3 className="text-xl font-semibold text-orange-600 mb-6">4. Required Documents</h3>
                  <div className="space-y-4">
                      {requiredDocs.map(doc => <FileUploadItem key={doc.id} doc={doc} file={formData.documents[doc.id]} onUpload={handleFileUpload} />)}
                  </div>
                  <div className="flex items-start space-x-3 mt-8 bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                    <ShieldCheck className="w-8 h-8 text-orange-500" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Declaration</h4>
                      <div className="flex items-center mt-2">
                        <input type="checkbox" id="declaration" required className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                        <label htmlFor="declaration" className="ml-2 text-sm text-gray-700">I hereby declare that all the information provided is true and correct to the best of my knowledge.</label>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                  <button type="button" onClick={handleBack} disabled={activeStep === 1} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                      <ArrowLeft className="w-5 h-5" />
                      <span>Previous Step</span>
                  </button>
                  {activeStep < steps.length && (
                      <button type="button" onClick={handleNext} className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">Next Step</button>
                  )}
                  {activeStep === steps.length && (
                      <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center w-40 disabled:bg-green-400">
                          {isSubmitting ? <LoaderCircle className="animate-spin w-5 h-5"/> : 'Submit Application'}
                      </button>
                  )}
              </div>
            </form>
          </div>

          {/* Side Info Panel */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-2xl shadow-md sticky top-6">
                <div className="flex items-center space-x-3 text-orange-600 border-b pb-4">
                    <Info className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Eligibility Criteria</h3>
                </div>
                <ul className="space-y-3 mt-4 text-sm text-gray-600 list-disc list-inside">
                    <li>Applicant must be a member of a Scheduled Caste (SC) community.</li>
                    <li>For NGOs/SHGs, over 51% of members must be from SC communities.</li>
                    <li>Annual family income should not exceed ₹3,00,000.</li>
                    <li>The proposed project must be economically viable and lead to income generation or skill enhancement.</li>
                    <li>All required documents must be valid and up-to-date.</li>
                </ul>
                 <div className="mt-6 bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-800">
                        For any queries, please contact the District Welfare Officer or visit the nearest helpdesk.
                    </p>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewProject;