import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const TradeData = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [extractedData, setExtractedData] = useState([]);
    const [consent, setConsent] = useState(false); 

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (file) {
            // OCR processing using Tesseract.js
            const { data: { text } } = await Tesseract.recognize(file, 'eng', {
                logger: (m) => console.log(m), // Optional logging
            });
            setExtractedText(text);
        } else {
            alert("Please select a file before submitting.");
        }
    };

    // Function to extract descriptions and items from the text
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

    // Function to handle data extraction
    const handleExtractData = () => {
        const data = extractDescriptionsAndItems(extractedText);
        setExtractedData(data);
    };

    return (
        <section
        className="pt-0 flex justify-center items-center flex-col pb-20 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip h-screen w-screen"
      >
            <h1 className="text-lg font-medium mb-4">Share Trade privately</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-lg font-medium text-blue-700 mb-2">
                       Add trade
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={handleFileChange}
                        className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-purple-500"
                    />
                </div>
                {/* Display selected file name */}
                {/* {fileName && (
                    <div className="mb-4 text-gray-700">
                        <strong>Selected File:</strong> {fileName}
                    </div>
                )} */}
                            {/* Button to extract data */}
            {file && (
                <button
                    onClick={handleExtractData}
                    className="mt-2 mb-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Extract Data
                </button>
            )}

            {/* Display extracted descriptions and items in vertical columns */}
            {extractedData.length > 0 && (
                <div className="mt-4 w-full max-w-md ">
                    <h2 className="text-sm font-semibold">Extracted Data:</h2>
                    <div className="flex border border-2 bg-gray-200">
                        <div className="w-1/2 pr-2 ">
                            {/* <h3 className="font-semibold">Descriptions:</h3> */}
                            <ul className="list-disc pl-4">
                                {extractedData.map((data, index) => (
                                    <li key={index} className="mb-2">
                                        {data.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-1/2 pl-2">
                            {/* <h3 className="font-semibold">Items:</h3> */}
                            <ul className="list-disc pl-4">
                                {extractedData.map((data, index) => (
                                    <li key={index} className="mb-2">
                                        {data.item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
                                {/* Consent checkbox */}
                                <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            id="consent"
                            checked={consent}
                            onChange={() => setConsent(!consent)}
                            className="mr-2"
                        />
                        <label htmlFor="consent" className="text-gray-700 text-sm">Give consent onchain</label>
                    </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md "
                >
                  Give consent
                </button>
            </form>
  </section>
    );
};

export default TradeData;
