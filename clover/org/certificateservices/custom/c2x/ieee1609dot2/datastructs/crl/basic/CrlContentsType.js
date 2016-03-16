var clover = new Object();

// JSON: {classes : [{name, id, sl, el,  methods : [{sl, el}, ...]}, ...]}
clover.pageData = {"classes":[{"el":109,"id":3729,"methods":[{"el":72,"sc":2,"sl":70},{"el":79,"sc":2,"sl":77},{"el":87,"sc":2,"sl":85},{"el":94,"sc":2,"sl":92},{"el":107,"sc":2,"sl":96}],"name":"CrlContentsType","sl":42},{"el":65,"id":3729,"methods":[{"el":64,"sc":3,"sl":53}],"name":"CrlContentsType.CrlContentsTypeChoices","sl":47}]}

// JSON: {test_ID : {"methods": [ID1, ID2, ID3...], "name" : "testXXX() void"}, ...};
clover.testTargets = {"test_308":{"methods":[{"sl":53},{"sl":77},{"sl":85},{"sl":92}],"name":"Verify that CrlContentsType is correctly encoded for type fullLinkedCrl","pass":true,"statements":[{"sl":55},{"sl":59},{"sl":62},{"sl":78},{"sl":86},{"sl":93}]},"test_467":{"methods":[{"sl":53},{"sl":70},{"sl":85},{"sl":92}],"name":"Verify that CrlContentsType is correctly encoded for type deltaHashCrl","pass":true,"statements":[{"sl":55},{"sl":57},{"sl":58},{"sl":71},{"sl":86},{"sl":93}]},"test_529":{"methods":[{"sl":85},{"sl":92},{"sl":96}],"name":"Verify toString","pass":true,"statements":[{"sl":86},{"sl":93},{"sl":98},{"sl":102},{"sl":105}]},"test_639":{"methods":[{"sl":85}],"name":"Verify that IllegalArgumentException is thrown when encoding if not all fields are set","pass":true,"statements":[{"sl":86}]},"test_65":{"methods":[{"sl":53},{"sl":85}],"name":"Verify that constructor and getters are correct and it is correctly encoded","pass":true,"statements":[{"sl":55},{"sl":59},{"sl":62},{"sl":86}]},"test_686":{"methods":[{"sl":53},{"sl":77},{"sl":85}],"name":"Verify that signed SecuredCrl with signed data is generated correctly","pass":true,"statements":[{"sl":55},{"sl":59},{"sl":62},{"sl":78},{"sl":86}]},"test_815":{"methods":[{"sl":70},{"sl":77},{"sl":92},{"sl":96}],"name":"Verify toString()","pass":true,"statements":[{"sl":71},{"sl":78},{"sl":93},{"sl":98},{"sl":99},{"sl":101},{"sl":102},{"sl":105}]},"test_889":{"methods":[{"sl":53},{"sl":77},{"sl":85},{"sl":92}],"name":"Verify that CrlContentsType is correctly encoded for type deltaLinkedCrl","pass":true,"statements":[{"sl":55},{"sl":60},{"sl":62},{"sl":78},{"sl":86},{"sl":93}]},"test_912":{"methods":[{"sl":53},{"sl":70},{"sl":85},{"sl":92}],"name":"Verify that CrlContentsType is correctly encoded for type fullHashCrl","pass":true,"statements":[{"sl":55},{"sl":56},{"sl":58},{"sl":71},{"sl":86},{"sl":93}]}}

// JSON: { lines : [{tests : [testid1, testid2, testid3, ...]}, ...]};
clover.srcFileLines = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [686, 467, 912, 65, 889, 308], [], [686, 467, 912, 65, 889, 308], [912], [467], [467, 912], [686, 65, 308], [889], [], [686, 65, 889, 308], [], [], [], [], [], [], [], [467, 912, 815], [467, 912, 815], [], [], [], [], [], [686, 815, 889, 308], [686, 815, 889, 308], [], [], [], [], [], [], [639, 686, 467, 529, 912, 65, 889, 308], [639, 686, 467, 529, 912, 65, 889, 308], [], [], [], [], [], [467, 529, 912, 815, 889, 308], [467, 529, 912, 815, 889, 308], [], [], [529, 815], [], [529, 815], [815], [], [815], [529, 815], [], [], [529, 815], [], [], [], []]