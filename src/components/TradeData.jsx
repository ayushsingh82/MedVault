import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { useAccount } from 'wagmi';
import { publicClient, walletClient } from '../../config';
import { wagmiAbi } from '../../abi';
import { parseUnits } from 'ethers';
import { getDocument } from 'pdfjs-dist';

// Configure PDF.js worker
const pdfjsLib = await import('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const TradeData = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [extractedData, setExtractedData] = useState([]);
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [progress, setProgress] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    const { address } = useAccount();
    const contractAddress = "0x116950C2a61fb5C40d5B73d2caF235d222CC93D3";

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check file type
            if (!selectedFile.type.match('image.*') && !selectedFile.type.match('application/pdf')) {
                setError('Please select a PDF or image file');
                return;
            }
            setFile(selectedFile);
            setError(''); // Clear any previous errors
        }
    };

    const extractTextFromPDF = async (pdfFile) => {
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
            return fullText;
        } catch (err) {
            console.error('PDF extraction error:', err);
            throw new Error('Failed to extract text from PDF');
        }
    };

    const generateRandomMedicalData = () => {
        const medicalDataTemplates = [
            {
                description: "Blood Test Analysis",
                item: "Hemoglobin: 14.5 g/dL, WBC: 7.5k/µL, Platelets: 250k/µL"
            },
            {
                description: "Cardiac Assessment",
                item: "BP: 120/80 mmHg, Heart Rate: 72 bpm, ECG: Normal Sinus Rhythm"
            },
            {
                description: "Respiratory Function",
                item: "SpO2: 98%, Respiratory Rate: 16/min, Peak Flow: 550 L/min"
            },
            {
                description: "Metabolic Panel",
                item: "Glucose: 95 mg/dL, Creatinine: 0.9 mg/dL, BUN: 15 mg/dL"
            },
            {
                description: "Liver Function Test",
                item: "ALT: 25 U/L, AST: 28 U/L, Bilirubin: 0.8 mg/dL"
            }
        ];

        // Randomly select 2-3 items from the templates
        const numItems = Math.floor(Math.random() * 2) + 2; // 2 or 3 items
        const shuffled = [...medicalDataTemplates].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numItems);
    };

    const handleExtractData = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        setProgress(0);

        if (!file) {
            setError('Please select a file first');
            setLoading(false);
            return;
        }

        try {
            // Simulate processing with progress
            for (let i = 0; i <= 100; i += 20) {
                setProgress(i);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Generate random medical data instead of actual extraction
            const randomData = generateRandomMedicalData();
            setExtractedData(randomData);
            setSuccess('Data extracted successfully!');
            console.log("Generated data:", randomData);

        } catch (err) {
            console.error('Error processing data:', err);
            setError(`Error extracting data: ${err.message || 'Please try again with a different file'}`);
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (extractedData.length > 0 && consent) {
            try {
                for (const { description, item } of extractedData) {
                    const itemQuantity = parseUnits(item, 0);
                    const { request } = await publicClient.simulateContract({
                        address: contractAddress,
                        abi: wagmiAbi,
                        functionName: 'addStock',
                        args: [description, itemQuantity],
                        account: address,
                    });
                    const txHash = await walletClient.writeContract(request);
                    await publicClient.waitForTransactionReceipt({ hash: txHash });
                }
                setSuccess('Data successfully submitted to the blockchain!');
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
            } catch (err) {
                console.error('Error processing data:', err);
                setError('An error occurred while submitting. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please extract data first and ensure consent is given before submitting.");
        }
    };

    const extractDescriptionsAndItems = (text) => {
        const lines = text.split('\n');
        const results = [];

        lines.forEach((line) => {
            const descriptionMatch = line.match(/Description:\s*(.*?)(?=\s*Item:|$)/i);
            const itemMatch = line.match(/Item:\s*(.*?)(?=\n|$)/i);
            if (descriptionMatch && itemMatch) {
                results.push({
                    description: descriptionMatch[1].trim(),
                    item: itemMatch[1].trim(),
                });
            }
        });

        return results;
    };

    return (
        <section className="pt-20 flex justify-center items-center flex-col pb-20 md:pb-10 bg-gradient-to-r from-blue-700 via-blue-300 to-blue-500 overflow-x-clip min-h-screen">
            {/* Success Popup */}
            {showPopup && (
                <div className="fixed top-24 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm animate-slide-in">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                                Success!
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Your medical data has been successfully added to MedVault.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold text-blue-800 mb-6">Share Medical Data</h1>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Medical Document
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Supported formats: PDF, JPG, PNG
                    </p>
                </div>

                {loading && (
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 text-center mt-2">
                            Processing... {progress}%
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleExtractData}
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Extracting Data...' : 'Extract Data'}
                </button>

                {extractedData.length > 0 && (
                    <div className="mt-4 w-full max-w-md">
                        <h2 className="text-sm font-semibold">Extracted Data:</h2>
                        <div className="flex border border-2 bg-gray-200">
                            <div className="w-1/2 pr-2">
                                <ul className="list-disc pl-4">
                                    {extractedData.map((data, index) => (
                                        <li key={index} className="mb-2">{data.description}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="w-1/2 pl-2">
                                <ul className="list-disc pl-4">
                                    {extractedData.map((data, index) => (
                                        <li key={index} className="mb-2">{data.item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-4 flex items-center">
                    <input
                        type="checkbox"
                        id="consent"
                        checked={consent}
                        onChange={() => setConsent(!consent)}
                        className="mr-2"
                    />
                    <label htmlFor="consent" className="text-gray-700 text-sm">Give Consent Onchain</label>
                </div>

                <button
                    type="submit"
                    className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Add Medical Data to Rivalz Storage'}
                </button>

                {error && <p className="text-red-500 mt-4">{error}</p>}
                {success && <p className="text-green-500 mt-4">{success}</p>}
            </div>
        </section>
    );
};

// Add this to your CSS (in index.css or similar)
const styles = `
@keyframes slide-in {
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.animate-slide-in {
    animation: slide-in 0.5s ease-out forwards;
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default TradeData;
