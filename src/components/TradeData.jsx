import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { useAccount } from 'wagmi';
import { publicClient, walletClient } from '../../config';
import { wagmiAbi } from '../../abi';
import { parseUnits } from 'ethers';

const TradeData = () => {
    const [file, setFile] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [extractedData, setExtractedData] = useState([]);
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { address } = useAccount();
    const contractAddress = "0x116950C2a61fb5C40d5B73d2caF235d222CC93D3";

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleExtractData = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        if (file) {
            try {
                const { data: { text } } = await Tesseract.recognize(file, 'eng');
                setExtractedText(text);

                const data = extractDescriptionsAndItems(text);
                setExtractedData(data);
                console.log(" data:", data);
                console.log("text",text);
            } catch (err) {
                console.error('Error processing data:', err);
                setError('An error occurred while extracting data. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please select a file before extracting data.");
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
        <section className="pt-0 flex justify-center items-center flex-col pb-20 md:pb-10 bg-gradient-to-r from-blue-700 via-blue-300 to-blue-500 overflow-x-clip h-screen w-screen">
            <h1 className="text-lg font-medium mb-4">Share Medical Privately</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-lg font-medium text-blue-700 mb-2">Add Trade</label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={handleFileChange}
                        className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-purple-500"
                    />
                </div>

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
            </form>
        </section>
    );
};

export default TradeData;
