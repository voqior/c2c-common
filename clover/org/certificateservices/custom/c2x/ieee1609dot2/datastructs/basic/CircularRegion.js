var clover = new Object();

// JSON: {classes : [{name, id, sl, el,  methods : [{sl, el}, ...]}, ...]}
clover.pageData = {"classes":[{"el":77,"id":2316,"methods":[{"el":38,"sc":2,"sl":35},{"el":48,"sc":2,"sl":43},{"el":56,"sc":2,"sl":54},{"el":64,"sc":2,"sl":62},{"el":70,"sc":2,"sl":67},{"el":75,"sc":2,"sl":72}],"name":"CircularRegion","sl":25}]}

// JSON: {test_ID : {"methods": [ID1, ID2, ID3...], "name" : "testXXX() void"}, ...};
clover.testTargets = {"test_107":{"methods":[{"sl":54},{"sl":62},{"sl":72}],"name":"Verify toString","pass":true,"statements":[{"sl":55},{"sl":63},{"sl":74}]},"test_140":{"methods":[{"sl":35},{"sl":43},{"sl":54},{"sl":62},{"sl":67}],"name":"Verify that constructor and getters are correct and it is correctly encoded","pass":true,"statements":[{"sl":36},{"sl":37},{"sl":44},{"sl":45},{"sl":46},{"sl":47},{"sl":55},{"sl":63},{"sl":68},{"sl":69}]},"test_154":{"methods":[{"sl":43},{"sl":54},{"sl":62},{"sl":67},{"sl":72}],"name":"Verify toString","pass":true,"statements":[{"sl":44},{"sl":45},{"sl":46},{"sl":47},{"sl":55},{"sl":63},{"sl":68},{"sl":69},{"sl":74}]},"test_753":{"methods":[{"sl":43},{"sl":67}],"name":"Verify that all fields must be set or IllegalArgumentException is thrown when encoding","pass":true,"statements":[{"sl":44},{"sl":45},{"sl":46},{"sl":68},{"sl":69}]},"test_949":{"methods":[{"sl":35},{"sl":67}],"name":"Verify that reference structure from D.5.2.2 of P1909.2_D12 is parsed and regenerated correctly","pass":true,"statements":[{"sl":36},{"sl":37},{"sl":68},{"sl":69}]}}

// JSON: { lines : [{tests : [testid1, testid2, testid3, ...]}, ...]};
clover.srcFileLines = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [949, 140], [949, 140], [949, 140], [], [], [], [], [], [753, 140, 154], [753, 140, 154], [753, 140, 154], [753, 140, 154], [140, 154], [], [], [], [], [], [], [107, 140, 154], [107, 140, 154], [], [], [], [], [], [], [107, 140, 154], [107, 140, 154], [], [], [], [949, 753, 140, 154], [949, 753, 140, 154], [949, 753, 140, 154], [], [], [107, 154], [], [107, 154], [], [], []]