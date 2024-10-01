const contractAddress = "0xB80FE87d80Fa2b229D5Bd241B1dE58097F396Faf";
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "charityId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "goalAmount",
                "type": "uint256"
            }
        ],
        "name": "CharityRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "charityId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "DonationReceived",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "charityId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "FundsReleased",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "charities",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "charityAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "goalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentAmount",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "charityCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_charityId",
                "type": "uint256"
            }
        ],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_charityId",
                "type": "uint256"
            }
        ],
        "name": "getCharityDetails",
        "outputs": [
            {
                "internalType": "address",
                "name": "charityAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "goalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentAmount",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_goalAmount",
                "type": "uint256"
            }
        ],
        "name": "registerCharity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let contract;
let signer;
let provider;

async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            document.getElementById('status').innerText = 'Wallet connected: ' + await signer.getAddress();
            document.getElementById('connectWallet').style.display = 'none';
            document.getElementById('disconnectWallet').style.display = 'block';
        } catch (error) {
            document.getElementById('status').innerText = 'Error: ' + error.message;
        }
    } else {
        document.getElementById('status').innerText = 'Ethereum provider not found. Please install MetaMask.';
    }
}

function disconnectWallet() {
    // MetaMask does not have a direct way to programmatically disconnect
    // User needs to disconnect from the MetaMask extension manually
    provider = null;
    signer = null;
    contract = null;
    document.getElementById('status').innerText = 'Wallet disconnected.';
    document.getElementById('connectWallet').style.display = 'block';
    document.getElementById('disconnectWallet').style.display = 'none';
}

async function registerCharity() {
    const name = document.getElementById('charityName').value;
    const description = document.getElementById('charityDescription').value;
    const goalAmount = ethers.utils.parseEther(document.getElementById('charityGoal').value);

    if (contract) {
        try {
            const tx = await contract.registerCharity(name, description, goalAmount);
            await tx.wait();
            document.getElementById('status').innerText = 'Charity registered successfully!';
        } catch (error) {
            document.getElementById('status').innerText = 'Error: ' + error.message;
        }
    } else {
        document.getElementById('status').innerText = 'Please connect your wallet first.';
    }
}

async function donate() {
    const charityId = document.getElementById('charityId').value;
    const donationAmount = ethers.utils.parseEther(document.getElementById('donationAmount').value);

    if (contract) {
        try {
            const tx = await contract.donate(charityId, { value: donationAmount });
            await tx.wait();
            document.getElementById('status').innerText = 'Donation successful!';
        } catch (error) {
            document.getElementById('status').innerText = 'Error: ' + error.message;
        }
    } else {
        document.getElementById('status').innerText = 'Please connect your wallet first.';
    }
}

async function getCharityDetails() {
    const charityId = document.getElementById('getCharityId').value;

    if (contract) {
        try {
            const details = await contract.getCharityDetails(charityId);
            document.getElementById('charityDetails').innerHTML = `
                <p>Charity Address: ${details.charityAddress}</p>
                <p>Name: ${details.name}</p>
                <p>Description: ${details.description}</p>
                <p>Goal Amount: ${ethers.utils.formatEther(details.goalAmount)} ETH</p>
                <p>Current Amount: ${ethers.utils.formatEther(details.currentAmount)} ETH</p>
                <p>Is Active: ${details.isActive}</p>
            `;
        } catch (error) {
            document.getElementById('status').innerText = 'Error: ' + error.message;
        }
    } else {
        document.getElementById('status').innerText = 'Please connect your wallet first.';
    }
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('disconnectWallet').addEventListener('click', disconnectWallet);
