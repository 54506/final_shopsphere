import React, { useState } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";

export default function VerifyGST() {
    const navigate = useNavigate();
    const [gstFile, setGstFile] = useState(null);
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            setError("Allowed: PDF, JPG, PNG");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("Max 10 MB");
            return;
        }
        setError("");
        setGstFile(file);
    };

    const handleContinue = () => {
        const isUserLoggedIn = !!localStorage.getItem("user");

        if (!gst) {
            setError("Please enter a GST number");
            return;
        }

        if (!validateGST(gst.toUpperCase())) {
            setError("Please enter a valid GST number");
            return;
        }

        if (!gstFile) {
            setError("Mandatory GST certificate upload required");
            return;
        }

        if (!isUserLoggedIn) {
            if (!credentials.username || !credentials.email || !credentials.password) {
                setError("Please fill in your account details to continue");
                return;
            }
        }

        setError("");
        setShowVerificationModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">
            <header className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-orange-400 to-purple-500 shadow-sm text-white font-bold">
                ShopSphere Seller Central
            </header>

            <main className="px-6 py-12">
                <StepProgress />

                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter GST Details</h2>
                    <p className="text-gray-500 mb-8">GST number and certificate are mandatory for legal compliance.</p>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">15-digit GST Number</label>
                        <input
                            type="text"
                            placeholder="22AAAAA0000A1Z5"
                            value={gst}
                            maxLength={15}
                            onChange={(e) => {
                                setGst(e.target.value.toUpperCase());
                                if (error) setError("");
                            }}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all 
                            ${error && !gst ? "border-red-500 focus:ring-red-200" : "border-purple-200 focus:ring-purple-500"}`}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload GST Certificate (Mandatory)</label>
                        <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 flex flex-col items-center gap-2 bg-purple-50/30">
                            <input type="file" onChange={handleFileChange} className="text-xs text-gray-500" />
                            {gstFile && <p className="text-xs text-green-600 font-bold italic">✓ {gstFile.name} uploaded</p>}
                        </div>
                    </div>

                    {!localStorage.getItem("user") && (
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="font-semibold text-gray-700">Account Creation</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    className="px-4 py-2 border border-purple-100 rounded-lg outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    className="px-4 py-2 border border-purple-100 rounded-lg outline-none"
                                />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full px-4 py-2 border border-purple-100 rounded-lg outline-none"
                            />
                        </div>
                    )}

                    {error && <p className="text-red-500 text-xs mt-3 font-medium">⚠ {error}</p>}

                    <div className="flex items-center gap-3 mt-8">
                        <input type="radio" onChange={() => navigate("/verifyPAN")} />
                        <label className="text-sm text-gray-700">I only sell non-GST categories (Verify via PAN)</label>
                    </div>

                    <div className="mt-10 flex justify-between items-center">
                        <p className="text-[10px] text-gray-400">🔒 Secure Verification Protocol Active</p>
                        <button
                            onClick={handleContinue}
                            disabled={!gst || !gstFile}
                            className={`px-8 py-3 bg-gradient-to-r from-orange-400 to-purple-500 text-white rounded-lg font-bold shadow-lg transition-all uppercase tracking-widest text-xs ${(!gst || !gstFile) ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-500'}`}
                        >
                            Verify & Continue
                        </button>
                    </div>
                </div>

                {showVerificationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
                            <h3 className="text-xl font-bold mb-4">GST Node Received</h3>
                            <p className="text-sm text-gray-600 mb-8 font-medium">Verification will be finalized during audit. You may proceed with store setup.</p>
                            <button
                                onClick={() => {
                                    localStorage.setItem("vendorGSTData", JSON.stringify({ gstNumber: gst, idType: "gst" }));
                                    localStorage.setItem("gst_number", gst);
                                    localStorage.setItem("id_type", "gst");
                                    if (!localStorage.getItem("user")) {
                                        localStorage.setItem("username", credentials.username);
                                        localStorage.setItem("email", credentials.email);
                                        localStorage.setItem("password", credentials.password);
                                    }
                                    // Normally we'd upload file here or save to local, 
                                    // but we handle final file upload in BankDetails step for now to maintain consistency with the API
                                    setShowVerificationModal(false);
                                    navigate("/store-name");
                                }}
                                className="px-10 py-4 bg-purple-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs"
                            >
                                Continue Registry
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>

    );
}
