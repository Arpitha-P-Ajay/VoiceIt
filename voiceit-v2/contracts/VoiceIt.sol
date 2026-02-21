// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VoiceIt {
    struct Report { address sender; string content; uint256 timestamp; }
    Report[] public reports;

    function submitReport(string memory _content) public {
        reports.push(Report(msg.sender, _content, block.timestamp));
    }

    function getReports() public view returns (Report[] memory) {
        return reports;
    }

    function getReportCount() public view returns (uint256) {
        return reports.length;
    }
}