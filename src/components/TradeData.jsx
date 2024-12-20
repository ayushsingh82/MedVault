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
            let text;
            if (file.type === 'application/pdf') {
                text = await extractTextFromPDF(file);
            } else {
                // For images
                const { data } = await Tesseract.recognize(file, 'eng', {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setProgress(parseInt(m.progress * 100));
                        }
                    }
                });
                text = data.text;
            }

            setExtractedText(text);
            const data = extractDescriptionsAndItems(text);
            
            if (data.length === 0) {
                throw new Error('No valid data could be extracted from the file');
            }

            setExtractedData(data);
            setSuccess('Data extracted successfully!');
            console.log("Extracted text:", text);
            console.log("Processed data:", data);

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
                    const itemQuantity = parseUnits(item, 0);  // Adjust units as necessary
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

export default TradeData;
