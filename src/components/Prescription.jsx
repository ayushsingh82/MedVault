import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const PrescriptionUploader = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [extractedData, setExtractedData] = useState([]);

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

            // Process text to extract descriptions and items
            const data = extractDescriptionsAndItems(text);
            setExtractedData(data);
        } else {
            alert("Please select a file before submitting.");
        }
    };

    // Function to extract descriptions and items from the text
    const extractDescriptionsAndItems = (text) => {
        // Split text into lines and initialize an empty array for the results
        const lines = text.split('\n');
        const results = [];

        lines.forEach((line) => {
            // Use regex to find descriptions and corresponding items
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Upload Medical Prescription</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        Select Prescription File:
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={handleFileChange}
                        className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-purple-500"
                    />
                </div>
                {/* Display selected file name */}
                {fileName && (
                    <div className="mb-4 text-gray-700">
                        <strong>Selected File:</strong> {fileName}
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                    Submit
                </button>
            </form>

            {/* Display extracted text */}
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Extracted Text:</h2>
                <p>{extractedText}</p>
            </div>

            {/* Display extracted descriptions and items in vertical columns */}
            <div className="mt-4 w-full max-w-md">
                <h2 className="text-xl font-semibold">Extracted Data:</h2>
                <div className="flex">
                    <div className="w-1/2 pr-2">
                        <h3 className="font-semibold">Descriptions:</h3>
                        <ul className="list-disc pl-4">
                            {extractedData.map((data, index) => (
                                <li key={index} className="mb-2">
                                    {data.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-1/2 pl-2">
                        <h3 className="font-semibold">Items:</h3>
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
        </div>
    );
};

export default PrescriptionUploader;
