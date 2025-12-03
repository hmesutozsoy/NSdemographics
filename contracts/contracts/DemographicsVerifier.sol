// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

/**
 * @title DemographicsVerifier
 * @notice Verifies Semaphore proofs for demographic data submission
 */
contract DemographicsVerifier is SemaphoreGroups {
    ISemaphore public semaphore;

    struct LocationProof {
        uint256 merkleTreeRoot;
        uint256 nullifierHash;
        uint256[8] proof;
    }

    struct DemographicData {
        string networkSchoolId;
        uint256 timestamp;
        int256 latitude; // Scaled by 1e6 for precision
        int256 longitude; // Scaled by 1e6 for precision
    }

    mapping(uint256 => bool) public nullifierHashes;
    mapping(string => uint256) public networkSchoolGroups;
    mapping(string => uint256) public memberCounts;

    event ProofVerified(
        string indexed networkSchoolId,
        uint256 nullifierHash,
        uint256 timestamp
    );

    constructor(address _semaphore) {
        semaphore = ISemaphore(_semaphore);
    }

    /**
     * @notice Create a new network school group
     * @param networkSchoolId Unique identifier for the network school
     * @param groupId Semaphore group ID
     */
    function createNetworkSchoolGroup(
        string memory networkSchoolId,
        uint256 groupId
    ) external {
        require(
            networkSchoolGroups[networkSchoolId] == 0,
            "Group already exists"
        );
        networkSchoolGroups[networkSchoolId] = groupId;
        _createGroup(groupId);
    }

    /**
     * @notice Verify a demographic proof
     * @param networkSchoolId Network school identifier
     * @param locationProof Semaphore proof data
     * @param demographicData Demographic information
     * @param signal Encrypted demographic signal
     */
    function verifyDemographicProof(
        string memory networkSchoolId,
        LocationProof memory locationProof,
        DemographicData memory demographicData,
        uint256 signal
    ) external {
        uint256 groupId = networkSchoolGroups[networkSchoolId];
        require(groupId != 0, "Network school group does not exist");

        require(
            !nullifierHashes[locationProof.nullifierHash],
            "Proof already used"
        );

        // Verify Semaphore proof
        semaphore.verifyProof(
            groupId,
            locationProof.merkleTreeRoot,
            signal,
            locationProof.nullifierHash,
            locationProof.proof
        );

        // Mark nullifier as used
        nullifierHashes[locationProof.nullifierHash] = true;

        // Update member count
        memberCounts[networkSchoolId]++;

        emit ProofVerified(
            networkSchoolId,
            locationProof.nullifierHash,
            demographicData.timestamp
        );
    }

    /**
     * @notice Get member count for a network school
     * @param networkSchoolId Network school identifier
     * @return count Number of verified members
     */
    function getMemberCount(
        string memory networkSchoolId
    ) external view returns (uint256) {
        return memberCounts[networkSchoolId];
    }

    /**
     * @notice Add a member to a network school group
     * @param networkSchoolId Network school identifier
     * @param identityCommitment Member's identity commitment
     */
    function addMember(
        string memory networkSchoolId,
        uint256 identityCommitment
    ) external {
        uint256 groupId = networkSchoolGroups[networkSchoolId];
        require(groupId != 0, "Network school group does not exist");
        _addMember(groupId, identityCommitment);
    }
}

