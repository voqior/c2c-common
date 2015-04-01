var clover = new Object();

// JSON: {classes : [{name, id, sl, el,  methods : [{sl, el}, ...]}, ...]}
clover.pageData = {"classes":[{"el":76,"id":5125,"methods":[{"el":44,"sc":2,"sl":39},{"el":51,"sc":2,"sl":46},{"el":56,"sc":2,"sl":53},{"el":63,"sc":2,"sl":58},{"el":75,"sc":2,"sl":65}],"name":"HashedIdSpec","sl":32}]}

// JSON: {test_ID : {"methods": [ID1, ID2, ID3...], "name" : "testXXX() void"}, ...};
clover.testTargets = {"test_149":{"methods":[{"sl":58}],"name":"Verify deserialization of a hash value","pass":true,"statements":[{"sl":60},{"sl":62}]},"test_194":{"methods":[{"sl":53}],"name":"Verify serialization of a hash value","pass":true,"statements":[{"sl":55}]},"test_235":{"methods":[{"sl":39}],"name":"Verify the correct octet length of the HashedId3","pass":true,"statements":[{"sl":41},{"sl":42}]},"test_58":{"methods":[{"sl":65}],"name":"Verify hashCode and equals","pass":true,"statements":[{"sl":67},{"sl":68},{"sl":69},{"sl":71},{"sl":72},{"sl":73},{"sl":74}]},"test_95":{"methods":[{"sl":46}],"name":"Verify IllegalArgumentException is thrown if to small hash value is given.","pass":true,"statements":[{"sl":48},{"sl":50}]}}

// JSON: { lines : [{tests : [testid1, testid2, testid3, ...]}, ...]};
clover.srcFileLines = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [235], [], [235], [235], [], [], [], [95], [], [95], [], [95], [], [], [194], [], [194], [], [], [149], [], [149], [], [149], [], [], [58], [], [58], [58], [58], [], [58], [58], [58], [58], [], []]