import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { publicClient, walletClient } from '../../config';
import { wagmiAbi } from '../../abi';

const Trade = () => {
    const [stocks, setStocks] = useState([
        {
            description: "Blood Test Results",
            item: "CBC, Lipid Profile, HbA1c",
            shared: false
        },
        {
            description: "X-Ray Report",
            item: "Chest X-Ray, 15/12/2023",
            shared: true
        },
        {
            description: "Vaccination Record",
            item: "COVID-19 Vaccination",
            shared: false
        },
        {
            description: "Medical Prescription",
            item: "Antibiotics Course",
            shared: true
        },
        {
            description: "Allergy Test",
            item: "Comprehensive Panel",
            shared: false
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { address } = useAccount();
    const contractAddress = "0x116950C2a61fb5C40d5B73d2caF235d222CC93D3";

    // Comment out the useEffect for now to show dummy data
    // useEffect(() => {
    //     fetchStocks();
    // }, [address]);

    const fetchStocks = async () => {
        if (!address) return;
        try {
            const data = await publicClient.readContract({
                address: contractAddress,
                abi: wagmiAbi,
                functionName: 'getStocks',
                args: [address],
            });
            setStocks(data);
        } catch (err) {
            console.error("Error fetching stocks:", err);
            setError("Failed to fetch medical data");
        }
    };

    const handleShare = async (description, item) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            // For demo, just update the local state
            setStocks(stocks.map(stock => 
                stock.description === description ? { ...stock, shared: true } : stock
            ));
            setSuccess('Medical data shared successfully!');
            
            // Commented out actual contract interaction for demo
            // const { request } = await publicClient.simulateContract({
            //     address: contractAddress,
            //     abi: wagmiAbi,
            //     functionName: 'shareStock',
            //     args: [description, item],
            //     account: address,
            // });
            // const hash = await walletClient.writeContract(request);
            // await publicClient.waitForTransactionReceipt({ hash });
            // fetchStocks();
        } catch (err) {
            console.error("Error sharing stock:", err);
            setError('Failed to share medical data');
        } finally {
            setTimeout(() => setLoading(false), 1000); // Simulate loading
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-r from-blue-700 via-blue-300 to-blue-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-blue-600">
                        <h3 className="text-xl font-semibold text-white">MedVault Data</h3>
                        <p className="text-sm text-blue-100 mt-1">Secure Medical Data Sharing Platform</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                            <p>{success}</p>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Item Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stocks.map((stock, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{stock.description}</div>
                                            <div className="text-sm text-gray-500">ID: {(index + 1).toString().padStart(4, '0')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{stock.item}</div>
                                            <div className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                stock.shared ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {stock.shared ? 'Shared' : 'Not Shared'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleShare(stock.description, stock.item)}
                                                disabled={loading || stock.shared}
                                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full 
                                                    ${stock.shared 
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'} 
                                                    transition-colors`}
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : stock.shared ? 'Shared' : 'Share Data'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trade;
