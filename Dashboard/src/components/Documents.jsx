import { useState } from "react";
import { Upload, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Documents() {
  const [documents, setDocuments] = useState([
    { name: "Aadhaar Card", status: "Verified", file: "aadhaar.pdf" },
    { name: "Caste Certificate", status: "Pending", file: "caste.pdf" },
    { name: "Project Proposal", status: "Verified", file: "proposal.pdf" },
    { name: "Bank Passbook", status: "Rejected", file: "passbook.pdf" },
    { name: "Quotation", status: "Pending", file: "" },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Verified":
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      case "Rejected":
        return <XCircle className="text-red-500 w-5 h-5" />;
      case "Pending":
        return <Clock className="text-yellow-500 w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedDocs = [...documents];
      updatedDocs[index].file = file.name;
      updatedDocs[index].status = "Pending";
      setDocuments(updatedDocs);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Documents</h1>

        <p className="text-gray-600 mb-4">
          Here you can view, upload, or update your documents required under the
          GIA scheme.
        </p>

        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-xl"
            >
              <div>
                <h2 className="font-medium text-gray-800">{doc.name}</h2>
                <p className="text-sm text-gray-600">
                  {doc.file ? (
                    <>
                      Uploaded:{" "}
                      <span className="text-orange-600">{doc.file}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">No file uploaded</span>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm font-medium">
                  {getStatusIcon(doc.status)}
                  <span
                    className={`${
                      doc.status === "Verified"
                        ? "text-green-600"
                        : doc.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <label className="flex items-center space-x-2 bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition">
                  <Upload className="w-4 h-4" />
                  <span>{doc.file ? "Update" : "Upload"}</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleUpload(index, e)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
