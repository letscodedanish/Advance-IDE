// Code for the Dashboard component goes here.
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from 'react-loader-spinner';
import { Socket } from "socket.io-client";


const SLUG_WORKS = ["car", "dog", "computer", "person", "inside", "word", "for", "please", "to", "cool", "open", "source"];
const SERVICE_URL = "http://localhost:3001";

function getRandomSlug() {
    let slug = "";
    for (let i = 0; i < 3; i++) {
        slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
    }
    return slug;
}

export const Dashboard = ({socket}: {socket: Socket}) => {

    const [language, setLanguage] = useState("node-js");
    const [replId, setReplId] = useState(getRandomSlug());
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [githubRepoLink, setGithubRepoLink] = useState("");
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();
    

    const handleCardClick = () => {
        setShowModal(true);
    };

    const handleCreateRepl = async () => {
        setLoaded(true);
        await axios.post(`${SERVICE_URL}/project`, { replId, language });
        navigate(`/coding/?replId=${replId}`);
        setLoaded(false);
    };
    
    const handleImportFromGitHub = async (langEm: string) => {
        try {
            await axios.post(`${SERVICE_URL}/project`, { replId, language: langEm });
            await socket?.emit('importFromGitHub', githubRepoLink);
            navigate(`/coding/?replId=${replId}`);
        } catch (error) {
            console.error("Error creating project or importing from GitHub:", error);
            setLoaded(false);
            setShowImportModal(true);  // Optionally show the modal again in case of an error
            //@ts-ignore
            alert("Error importing from GitHub: " + error.message);
        }
    };
    

    if (loaded) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <InfinitySpin
                    //@ts-ignore
                    visible={true}
                    width="200"
                    color="#4fa94d"
                    ariaLabel="infinity-spin-loading"
                />
            </div>
        );
    }

    const handleLanguage = async (lang: string) => {
        setLoaded(true);
        await axios.post(`${SERVICE_URL}/project`, { replId, language: lang });
        navigate(`/coding/?replId=${replId}`);
        setLoaded(false);
    };

    return (
        <div className='flex flex-col mx-auto h-screen w-screen bg-black'>
            <div className='mt-10 ml-20'>
                <h1 className='text-white text-[50px]'>Instant Cloud</h1>
                <h1 className='text-yellow-600 text-[50px]'>Development</h1>
            </div>
            <div className='flex flex-row mt-20 ml-12'>
                <div className="card" onClick={handleCardClick}>
                    <h2 className='bg-blue-500 hover:bg-blue-700 hover:cursor-pointer text-white font-bold py-2 px-4 rounded w-[130px] text-center'>Create Repl</h2>
                </div>
                <div className="card" onClick={() => handleLanguage('node-js')}>
                    <h2 className='bg-green-500 hover:bg-gray-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded w-[130px] text-center'>Create JS</h2>
                </div>
                <div className="card" onClick={() => handleLanguage('react-js')}>
                    <h2 className='bg-green-500 hover:bg-gray-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded w-[130px] text-center'>Create React</h2>
                </div>
                <div className="card" onClick={() => setShowImportModal(true)}>
                    <h2 className='bg-yellow-500 hover:bg-gray-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded w-[130px] text-center'>Import from GitHub</h2>
                </div>
            </div>
            
            {showModal && (
                <div className="modal border-white border m-4 p-4 w-60 mx-auto relative -top-[200px] left-[200px] text-center rounded-md">
                    <h2 className='text-[20px] mb-4 font-mono m'>Choose Environment</h2>
                    <input
                        type="text"
                        placeholder="Repl Name"
                        value={replId}
                        onChange={(e) => setReplId(e.target.value)}
                        className="mb-2 p-2 border border-gray-300 rounded text-black font-mono"
                    />
                    <select
                        name="language"
                        id="language"
                        onChange={(e) => setLanguage(e.target.value)}
                        className="mb-2 p-2 border border-gray-300 rounded text-black font-mono"
                    >
                        <option value="node-js">Node.js</option>
                        <option value="python">Python</option>
                        <option value="react-js">React.js</option>
                    </select>
                    
                    <button onClick={handleCreateRepl} className="bg-white hover:bg-black hover:text-white border border-white text-black font-bold ml-2 py-2 px-4 rounded mt-2 font-mono">Create Repl</button>
                    
                </div>
            )}

            {showImportModal && (
                <div className="modal border-white border m-4 p-4 w-60 mx-auto relative -top-[200px] left-[200px] text-center rounded-md">
                    <h2 className='text-[20px] mb-4 font-mono m'>Import from GitHub</h2>
                    <input
                        type="text"
                        placeholder="GitHub Repository Link"
                        value={githubRepoLink}
                        onChange={(e) => setGithubRepoLink(e.target.value)}
                        className="mb-2 p-2 border border-gray-300 rounded text-black font-mono"
                    />
                    <button onClick={()=>handleImportFromGitHub('empty')} className="bg-white hover:bg-black hover:text-white border border-white text-black font-bold ml-2 py-2 px-4 rounded mt-2 font-mono">Import</button>
                </div>
            )}
        </div>
    );
};
