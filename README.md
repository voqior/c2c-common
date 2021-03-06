# Java Implementation of ITS Intelligent Transport Systems (ITS) Security header and certificate formats
# ETSI TS 103 097 V1.3.1, ETSI TS 102 941 V1.3.1 and IEEE 1609.2a 2017

This is a library used to generate data structures from the ETSI TS 103 097 v1.3.1, ETSI TS 102 941 v1.3.1 (EU) and IEEE 1609.2 2016 (With 1609.2a 2017 Amendment) (US) specification.

# License
The software is released under AGPL, see LICENSE.txt for more details. In order to get the software under a different licensing agreement please contact p.vendil (at) cgi.com

# What's new in 2.0.0-Beta3

- Updated support to Etsi TS 102 941 v 1.3.1

# What's new in 2.0.0-Beta2

- Support for generating CA Messages according to Etsi TS 102 941 v 1.2.1
- Fix for bad encoding of Time64 data structures (it used nano seconds instead of milliseconds).
- Changed compile target to JDK 8.
- Some refactoring.

# What's new in 2.0.0-Beta1

- Updated IEEE 1609.2 support to 2016 with 1609.2a 2017 amendment.
- Added support to generate new ITS ETSI TS 103 097 V1.3.1 structures based on 1609.2a 2017 
- Added test vector test of cryptographic algorithms from IEEE 1609.2a 2017
- Removed old ITS ETSI TS 103 097 V1.2.1 code and generators
- Fixed problem with COERBoolean

# What's new in 0.9.8

- Added support for ETSI TS 103 097 V1.2.1 (Version 2 certificate and SecureMessages), V2 Certificates and SecureMessages have been interoperability tested 
with ETSI test tool from ts_10309603v010201p0 package. (Tests was done to verify generated messages and generation and parsing of certificates). 
- Added utility methods to retrieve java.security variant of verification public key from certificates (common API for both US and EU standard)


# What's New in 0.9.7

- Added support for IEEE 1609.2 certificate (US standard)

# What's New in 0.9.6

- Improved automatic build of project.

# What's New in 0.9.5

- Interoperability testing of all aspects except encryption.
- Bug-fixes on signature generation where trailer field signature type wasn't included in the digest calculation.

# What's New in 0.9.0

- Ecies Encryption scheme support in DefaultCryptoManager
- Restructured the behaviour of CryptoManager verifySecuredMessage to throw InvalidITSSignatureException instead of returning a boolean


# EU Standard ETSI TS 103 097 V1.3.1

It supports generation of the following data structures will all related substructures:

- Root CA Certificate
- Enrollment CA Certificate
- Authorization CA Certificate
- Enrollment Credential Certificate
- Authorization Ticket
- Trust List Manager Certificate
- Secure Messages (CAM and DENM) and others

See Javadoc and examples below for more detailed information.

## Example Code 

Full example code can be seen in src/test/java/org/certificateservices/custom/c2x/demo it contains demo of both ETSI (EU) and IEEE (US) standards.

Before doing anything else you need to initialize a CryptoManager used for all cryptographic operations.

```

    	//Create a crypto manager in charge of communicating with underlying cryptographic components
	    CryptoManager cryptoManager = new DefaultCryptoManager();	
	    // Initialize the crypto manager to use soft keys using the bouncy castle cryptographic provider.
	    cryptoManager.setupAndConnect(new DefaultCryptoManagerParams("BC"));
```

### Root CA
Example code on how to generate Root a CA, use the AuthorityCertGenerator:

```

	    // Create an authority certificate generator and initialize it with the crypto manager. 
	    ETSIAuthorityCertGenerator authorityCertGenerator = new ETSIAuthorityCertGenerator(cryptoManager);
	    
	    // Generate a reference to the Root CA Keys	    
	    KeyPair rootCASigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    KeyPair rootCAEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);

	    ValidityPeriod rootCAValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 45);
	    List<Integer> countries = new ArrayList<Integer>();
	    countries.add(SWEDEN);
		GeographicRegion region = GeographicRegion.generateRegionForCountrys(countries);
		
	    // Generate the root CA Certificate, without any encryption keys or geographic region.
	    EtsiTs103097Certificate rootCACertificate = authorityCertGenerator.genRootCA("testrootca.test.com", // caName
	    		rootCAValidityPeriod, //ValidityPeriod
	    		region, //GeographicRegion
                3, // minChainDepth
                -1, // chainDepthRange
				Hex.decode("0138"), // cTLServiceSpecificPermissions, 2 octets
	    		SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
	    		rootCASigningKeys.getPublic(), // signPublicKey
	    		rootCASigningKeys.getPrivate(), // signPrivateKey
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256,  // encPublicKeyAlgorithm
	    		rootCAEncryptionKeys.getPublic()); // encPublicKey
		// There also exists a more general root ca generation method giving more flexibility in parameters.

```

### Enrollment CA
To generate an Enrollment CA:

```

	    // Generate a reference to the Enrollment CA Keys	    
	    KeyPair enrollmentCASigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    KeyPair enrollmentCAEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    
	    ValidityPeriod enrollmentCAValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 37);

	    // Generate a reference to the Enrollment CA Signing Keys
		EtsiTs103097Certificate enrollmentCACertificate =authorityCertGenerator.genEnrollmentCA("testea.test.com", // CA Name
				enrollmentCAValidityPeriod, 
				region,  //GeographicRegion
				new SubjectAssurance(1,3), // subject assurance (optional)
                SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
                enrollmentCASigningKeys.getPublic(), // signPublicKey, i.e public key in certificate
				rootCACertificate, // signerCertificate
				rootCASigningKeys.getPublic(), // signCertificatePublicKey, must be specified separately to support implicit certificates.
				rootCASigningKeys.getPrivate(),
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256,  // encPublicKeyAlgorithm
	    		enrollmentCAEncryptionKeys.getPublic() // encryption public key
	    		);

```

## Authority CA
To generate an Authority CA:

```

	    // Generate a reference to the Authorization CA Keys	    
	    KeyPair authorityCASigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    KeyPair authorityCAEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    
	    ValidityPeriod authorityCAValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 15);

	    // Generate a reference to the Authorization CA Signing Keys
		EtsiTs103097Certificate authorityCACertificate = authorityCertGenerator.genAuthorizationCA(
				"testaa.test.com", // CA Name
	    		authorityCAValidityPeriod, 
				region,  //GeographicRegion
				new SubjectAssurance(1,3), // subject assurance (optional)
                SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
                authorityCASigningKeys.getPublic(), // signPublicKey, i.e public key in certificate
				rootCACertificate, // signerCertificate
				rootCASigningKeys.getPublic(), // signCertificatePublicKey,
				rootCASigningKeys.getPrivate(),
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256,  // encPublicKeyAlgorithm
	    		authorityCAEncryptionKeys.getPublic() // encryption public key
	    		);

```

### Enrollment Credential

To create an Enrollment Credential use the EnrollmentCredentialCertGenerator.

```

	    // First we create a Enrollment Credential Cert Generator using the newly created Enrollment CA.
		ETSIEnrollmentCredentialGenerator enrollmentCredentialCertGenerator = new ETSIEnrollmentCredentialGenerator(cryptoManager);
	    // Next we generate keys for an enrollment credential.
	    KeyPair enrollmentCredentialSigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    // Next we generate keys for an enrollment credential.
	    KeyPair enrollmentCredentialEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);

	    ValidityPeriod enrollCertValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 35);

	    // Then use the following command to generate a enrollment credential
		EtsiTs103097Certificate enrollmentCredential = enrollmentCredentialCertGenerator.genEnrollCredential(
				"0102030405060708", // unique identifier name
	    		enrollCertValidityPeriod, 
	    		region,
	    		Hex.decode("01C0"), //SSP data set in SecuredCertificateRequestService appPermission, two byte, for example: 0x01C0
	    		3, // assuranceLevel
				7, // confidenceLevel
	    		SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
	    		enrollmentCredentialSigningKeys.getPublic(), // signPublicKey, i.e public key in certificate
	    		enrollmentCACertificate, // signerCertificate
	    		enrollmentCASigningKeys.getPublic(), // signCertificatePublicKey,
	    		enrollmentCASigningKeys.getPrivate(), 
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm 
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256, // encPublicKeyAlgorithm
	    		enrollmentCredentialEncryptionKeys.getPublic() // encryption public key
	    		);

	    // There also exists a more general method with flexible app permissions.
	    		
```

### Authorization Ticket 
To create an Authorization Ticket l use the AuthorizationTicketCertGenerator.

```

	    // Authorization tickets are created by the ETSIAuthorizationTicketGenerator
		ETSIAuthorizationTicketGenerator authorizationCertGenerator = new ETSIAuthorizationTicketGenerator(cryptoManager);
	    
	    // Next we generate keys for an authorization certificate.
	    KeyPair authorizationTokenSigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    
	    // Next we generate keys for an authorization certificate.
	    KeyPair authorizationTicketEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);

	    ValidityPeriod authorizationCertValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 35);

		PsidSsp[] appPermissions = new PsidSsp[1];
		appPermissions[0] = new PsidSsp(new Psid(6), null); // Insert proper app permissions here.
	    
	    // Generate a certificate as an explicit certificate.
		EtsiTs103097Certificate authorizationCert = authorizationCertGenerator.genAuthorizationTicket(
	    		authorizationCertValidityPeriod, // Validity Period
	    		region, // region,
				new SubjectAssurance(1,3), // Subject Assurance, optional
	    		appPermissions,
	    		SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
				authorizationTokenSigningKeys.getPublic(), // signPublicKey, i.e public key in certificate
	    		authorityCACertificate, // signerCertificate
	    		authorityCASigningKeys.getPublic(), // signCertificatePublicKey,
	    		authorityCASigningKeys.getPrivate(), 
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm 
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256, // encPublicKeyAlgorithm
				authorizationTicketEncryptionKeys.getPublic() // encryption public key
	    		);
```

### Trust List Manager Certificate

To create a trust list manager certificate.

```

		// Generate a reference to the Root CA Keys
		KeyPair tlmSigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
		KeyPair tlmEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);


		ValidityPeriod tlmValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 45);
		// Generate the root CA Certificate, without any encryption keys or geographic region.
		EtsiTs103097Certificate trustListManagerCertificate = authorityCertGenerator.genTrustListManagerCert(
				"testtlm.test.com", // name
				rootCAValidityPeriod, //ValidityPeriod
				region, //GeographicRegion, optional
				Hex.decode("01C8"), // cTLServiceSpecificPermissions, 2 octets
				SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
				rootCASigningKeys.getPublic(), // signPublicKey
				rootCASigningKeys.getPrivate() // signPrivateKey
				 );
		// There also exists a more general root ca generation method giving more flexibility in parameters.
```

### Secured Messages

To create Secured Messages such as CAM or DENM use the SecuredMessageGenerator.

```

	    	    // EtsiTs103097Data are created by the Secure Message Generator
        		ETSISecuredDataGenerator securedMessageGenerator = new ETSISecuredDataGenerator(ETSISecuredDataGenerator.DEFAULT_VERSION, cryptoManager, HashAlgorithm.sha256, SignatureChoices.ecdsaNistP256Signature);
        
        		// To generate a Signed CA Message it is possible to use
        		List<HashedId3> hashedId3s = new ArrayList<HashedId3>();
        		hashedId3s.add(new HashedId3(cryptoManager.digest(rootCACertificate.getEncoded(),HashAlgorithm.sha256)));
        		hashedId3s.add(new HashedId3(cryptoManager.digest(enrollmentCACertificate.getEncoded(),HashAlgorithm.sha256)));
        		SequenceOfHashedId3 inlineP2pcdRequest = new SequenceOfHashedId3(hashedId3s);
        
        		byte[] cAMessageData = Hex.decode("SomeCAMessage");
        		EtsiTs103097DataSigned cAMessage = securedMessageGenerator.genCAMessage(new Time64(new Date()), // generationTime
        				inlineP2pcdRequest, //  InlineP2pcdRequest (Required)
        				rootCACertificate, // requestedCertificate
        				cAMessageData, // inner opaque CA message data
        				SecuredDataGenerator.SignerIdentifierType.SIGNER_CERTIFICATE, // signerIdentifierType
        				authorizationCert, // signerCertificate
        				authorizationTokenSigningKeys.getPrivate()); // signerPrivateKey
        
        
        		// To generate a Signed DEN Message
        		byte[] dENMessageData = Hex.decode("SomeDENMessage");
        		EtsiTs103097DataSigned dENMessage = securedMessageGenerator.genDENMessage(
        				new Time64(new Date()), // generationTime
        				new ThreeDLocation(1,2,3), // generationLocation
        				dENMessageData, // inner opaque DEN message data
        				authorizationCert, // signerCertificate
        				authorizationTokenSigningKeys.getPrivate()); // signerPrivateKey
        
        		// The securedMessageGenerator also have methods to generate more general EtsiTs103097Data profiles such as
        		// EtsiTs103097DataSigned, EtsiTs103097DataSignedExternalPayload, EtsiTs103097DataEncrypted and
        		// EtsiTs103097DataSignedAndEncrypted.
        
        	    // It is then possible to create a signed message with the following code
        	      // First generate a Header with
        	    HeaderInfo hi = securedMessageGenerator.genHeaderInfo(
        	    		123L, // psid Required,
        	    		null, // generationTime Optional
        	    		null, // expiryTime Optional
        	    		null, // generationLocation Optional
        	    		null, // p2pcdLearningRequest Optional
        	    		null, // cracaid Optional
        	    		null, // crlSeries Optional
        	    		null, // encType Type of encryption when encrypting a message with a encryption key references in a signed message instead of a certificate. Optional
        	    		null, // encryptionKey Optional
        				null, // inlineP2pcdRequest Optional
        		null // requestedCertificate Optional
        	    		);
        
        	    // This method can be used to sign the data
        		EtsiTs103097DataSigned signedData = securedMessageGenerator.genEtsiTs103097DataSigned(hi,
        	    		"TestData".getBytes(), // The actual payload message to sign.
        	    		SecuredDataGenerator.SignerIdentifierType.HASH_ONLY, // One of  HASH_ONLY, SIGNER_CERTIFICATE, CERT_CHAIN indicating reference data of the signer to include in the message
        	    		new EtsiTs103097Certificate[] {authorizationCert,authorityCACertificate, rootCACertificate}, // The chain is required even though it isn't included in
        	    		  // the message if eventual implicit certificates need to have it's public key reconstructed.
        	    		authorizationTokenSigningKeys.getPrivate()); // Signing Key
        		// It is also possible to generate a EtsiTs103097DataSignedExternalPayload with the genEtsiTs103097DataSignedExternalPayload()
        		// method.
        
        	    // The message can be encrypted with the method
        	      // First construct a list of recipient which have the public key specified either as a symmetric key, certificate or in header of signed data
        	      // In this example we will use certificate as reciever, see package org.certificateservices.custom.c2x.ieee1609dot2.generator.recipient for more details.
        		EtsiTs103097DataEncrypted encryptedData = securedMessageGenerator.genEtsiTs103097DataEncrypted(BasePublicEncryptionKeyChoices.ecdsaNistP256,
        	    		  signedData.getEncoded(), new Recipient[] {new CertificateRecipient(enrollmentCredential)});
        
        	    // It is also possible to sign and encrypt in one go.
        		EtsiTs103097DataEncrypted encryptedAndSignedMessage = securedMessageGenerator.genEtsiTs103097DataSignedAndEncrypted(hi,
        	    		"TestData2".getBytes(),
        	    		SecuredDataGenerator.SignerIdentifierType.HASH_ONLY,
        	    		new EtsiTs103097Certificate[] {authorizationCert,authorityCACertificate, rootCACertificate},
        				authorizationTokenSigningKeys.getPrivate(), // Important to use the reconstructed private key for implicit certificates
        	    		BasePublicEncryptionKeyChoices.ecdsaNistP256,
        	    		new Recipient[] {new CertificateRecipient(enrollmentCredential)});
        
        	    // To decrypt and verify a signed message it is possible to use the following
        	      // First build a truststore of trust anchors (root CA certificate or equivalent)
        	    Map<HashedId8, Certificate> trustStore = securedMessageGenerator.buildCertStore(new EtsiTs103097Certificate[] {rootCACertificate});
        	      // Second build a store of known certificate that might be referenced in the message.
        	    Map<HashedId8, Certificate> certStore = securedMessageGenerator.buildCertStore(new EtsiTs103097Certificate[] {authorizationCert, authorityCACertificate});
        	      // To decrypt build a reciever store of known decryption keys and related receiver info, this can be certificate, signed message containing encryption key
        	      // in header, symmetric key or pre shared key.
        	    Map<HashedId8, Receiver> recieverStore = securedMessageGenerator.buildRecieverStore(new Receiver[] { new CertificateReciever(enrollmentCredentialEncryptionKeys.getPrivate(), enrollmentCredential)});
        		  // Finally perform the decryption and verification of siganture with.
        		DecryptAndVerifyResult decryptAndVerifyResult = securedMessageGenerator.decryptAndVerifySignedData(encryptedAndSignedMessage.getEncoded(),
        	    		certStore,
        	    		trustStore,
        	    		recieverStore,
        	    		true, //requiredSignature true if message must be signed otherwise a IllegalArgument is throwm
        	    		true //requireEncryption true if message must be encrypted otherwise a IllegalArgument is throwm
        	    		);
        		   // The decryptAndVerifyResult contains the inner opaque data, the related header info and signer identifier
        		   // if related message was signed.
        
        	      // It is also possible to use the methods decryptData or verifySignedData (or verifyReferencedSignedData) for alternative methods to verify and decrypt messages.

```


### To Encode and Decode Certificates and Secured Messages

```

	    // To encode a certificate to a byte array use the following method
	    byte[] certificateData = authorizationCert.getEncoded();
	    
	    // To decode certificate data use the following constructor
	    EtsiTs103097Certificate decodedCertificate = new EtsiTs103097Certificate(certificateData);
		
	    // To decode message data use the following constructor.
	    EtsiTs103097Data decodedMessage = new EtsiTs103097Data(messageData);
	    // If the message profile is known there also exists EtsiTs103097DataSigned, EtsiTs103097DataSignedExternalPayload,
	    // EtsiTs103097DataEncrypted classes that performs validation according to each profile.
```


# EU Standard ETSI TS 102 941 V1.3.1

It supports generation of the following data structures will all related substructures:

- Enrol Request/Response Message
- Authorization Request/Response Message
- Authorization Validation Request/Response Message
- CRL and CTL Messages
- CA Request Message (With Rekey)

See Javadoc and examples below for more detailed information.

## Example Code 

Full example code can be seen in src/test/java/org/certificateservices/custom/c2x/demo. The
example code assumes you have access to a generated PKI according to ETSI TS 103 097 standard.

Before generating any CA Message create a CA Message generator with:

```
        // Create a ETSITS102941MessagesCaGenerator generator
        messagesCaGenerator = new ETSITS102941MessagesCaGenerator(Ieee1609Dot2Data.DEFAULT_VERSION,
                cryptoManager, // The initialized crypto manager to use.
                HashAlgorithm.sha256, // digest algorithm to use.
                Signature.SignatureChoices.ecdsaNistP256Signature,  // define which signature scheme to use.
                false); // If EC points should be represented as uncompressed.

```

### EnrolRequestMessage

To create an EnrolRequestMessage use the following code.

```
        // First create the InnerEcRequest object
        InnerEcRequest initialInnerEcRequest = genDummyInnerEcRequest(enrolCredSignKeys.getPublic());
        EtsiTs103097DataEncryptedUnicast initialEnrolRequestMessage = messagesCaGenerator.genInitialEnrolmentRequestMessage(
                new Time64(new Date()), // generation Time
                initialInnerEcRequest,
                enrolCredSignKeys.getPublic(),enrolCredSignKeys.getPrivate(), // The key pair used in the enrolment credential used for self signed PoP
                enrolmentCACert); // The EA certificate to encrypt message to.

        // All messages can be encoded to byte[] using
        byte[] encodedMessage = initialEnrolRequestMessage.getEncoded();

        // To parse and encoded message create a new instance of related EtsiTs103097Data profile.
        EtsiTs103097DataEncryptedUnicast decodedMessage = new EtsiTs103097DataEncryptedUnicast(encodedMessage);

        // To Create an rekey EnrolRequestMessage use the following code.
        
        // Use a separate method when performing rekey that contains signature of previous message.
        InnerEcRequest reKeyInnerEcRequest = genDummyInnerEcRequest(enrolCredReSignKeys.getPublic());
        EtsiTs103097DataEncryptedUnicast rekeyEnrolRequestMessage = messagesCaGenerator.genRekeyEnrolmentRequestMessage(
                new Time64(new Date()), // generation Time
                reKeyInnerEcRequest, // Inner EC Request containing PublicKeys with new keys.
                enrollmentCredCertChain, // The certificate chain of the current (old) enrolment credential.
                enrolCredSignKeys.getPrivate(), // Private key if current (old) enrolment credential.
                enrolCredReSignKeys.getPublic(),enrolCredReSignKeys.getPrivate(), // The key pair used in the enrolment credential used for self signed PoP
                enrolmentCACert); // The EA certificate to encrypt message to.

```

To verify a EnrolRequestMessage use:

```
        // First build a certificate store and a trust store to verify signature.
        // These can be null if only initial messages are used.
        Map<HashedId8, Certificate> enrolCredCertStore = messagesCaGenerator.buildCertStore(enrollmentCredCertChain);
        Map<HashedId8, Certificate> trustStore = messagesCaGenerator.buildCertStore(new EtsiTs103097Certificate[]{rootCACert});

        // Then create a receiver store to decrypt the message
        Map<HashedId8, Receiver> enrolCAReceipients = messagesCaGenerator.buildRecieverStore(new Receiver[] {new CertificateReciever(enrolCAEncKeys.getPrivate(),enrolmentCACert)});
        // Then decrypt and verify with:
        // Important: this method only verifies the signature, it does not validate header information.
        RequestVerifyResult<InnerEcRequest> enrolmentRequestResult = messagesCaGenerator.decryptAndVerifyEnrolmentRequestMessage(rekeyEnrolRequestMessage,enrolCredCertStore,trustStore,enrolCAReceipients);
        // The verify result for enrolment request returns a special value object containing both inner message and
        // requestHash used in response.

        // The result object of all verify message method contains the following information:
        enrolmentRequestResult.getSignerIdentifier(); // The identifier of the signer
        enrolmentRequestResult.getHeaderInfo(); // The header information of the signer of the message
        enrolmentRequestResult.getValue(); // The inner message that was signed and or encrypted.
        enrolmentRequestResult.getSecretKey(); // The symmetrical key used in Ecies request operations and is set when verifying all
        // request messages. The secret key should usually be used to encrypt the response back to the requester.
```

### EnrolResponseMessage

To generate and verify EnrolResponseMessage

```
        // First generate a InnerECResponse
        InnerEcResponse innerEcResponse = new InnerEcResponse(enrolmentRequestResult.getRequestHash(), EnrollmentResponseCode.ok,enrolmentCredCert);
        // Then generate the EnrolmentResponseMessage with:
        EtsiTs103097DataEncryptedUnicast enrolResponseMessage = messagesCaGenerator.genEnrolmentResponseMessage(
                new Time64(new Date()), // generation Time
                innerEcResponse,
                enrollmentCAChain, // Chain of EA used to sign message
                enrolCASignKeys.getPrivate(),
                SymmAlgorithm.aes128Ccm, // Encryption algorithm used
                enrolmentRequestResult.getSecretKey()); // Use symmetric key from the verification result when verifying the request.

        // To verify EnrolResponseMessage use:
        // Build certstore
        Map<HashedId8, Certificate> enrolCACertStore = messagesCaGenerator.buildCertStore(enrollmentCAChain);

        // Build reciever store containing the symmetric key used in the request.
        Map<HashedId8, Receiver> enrolCredSharedKeyReceivers = messagesCaGenerator.buildRecieverStore(new Receiver[] {new PreSharedKeyReceiver(enrolmentRequestResult.getSecretKey())});
        VerifyResult<InnerEcResponse> enrolmentResponseResult = messagesCaGenerator.decryptAndVerifyEnrolmentResponseMessage(
                enrolResponseMessage,
                enrolCACertStore, // Certificate chain if EA CA
                trustStore,
                enrolCredSharedKeyReceivers
        );
```

### AuthorizationRequestMessage

To generate and verify AuthorizationRequestMessage

```
        // To generate an AuthorizationRequestMessage it is possible to generate
        // the message with and without POP and privacy set. This example generates
        // message with POP and privacy.

        // First generate a PublicKeys, hmacKey and SharedAtRequest structures
        PublicKeys publicKeys = messagesCaGenerator.genPublicKeys(signAlg,authTicketSignKeys.getPublic(),SymmAlgorithm.aes128Ccm,encAlg, authTicketEncKeys.getPublic());
        byte[] hmacKey = genHmacKey();
        SharedAtRequest sharedAtRequest = genDummySharedAtRequest(publicKeys, hmacKey);

        EtsiTs103097DataEncryptedUnicast authRequestMessage = messagesCaGenerator.genAuthorizationRequestMessage(
                new Time64(new Date()), // generation Time
                publicKeys,
                hmacKey,
                sharedAtRequest,
                enrollmentCredCertChain, // Certificate chain of enrolment credential to sign outer message to AA
                enrolCredSignKeys.getPrivate(), // Private key used to sign message.
                authTicketSignKeys.getPublic(), //The public key of the auth ticket, used to create POP, null if no POP should be generated.
                authTicketSignKeys.getPrivate(), // The private key of the auth ticket, used to create POP, null if no POP should be generated.
                authorizationCACert, // The AA certificate to encrypt outer message to.
                enrolmentCACert, // Encrypt inner ecSignature with given certificate, required if withPrivacy is true.
                true // Encrypt the inner ecSignature message sent to EA
        );

         // To verify an AuthorizationRequest use the following code.
       
         // Build a recipient store for Authorization Authority
        Map<HashedId8, Receiver> authorizationCAReceipients = messagesCaGenerator.buildRecieverStore(new Receiver[] {new CertificateReciever(authorizationCAEncKeys.getPrivate(),authorizationCACert)});

        // To decrypt the message and verify the external POP signature (not the inner eCSignature signed for EA CA).
        RequestVerifyResult<InnerAtRequest> authRequestResult = messagesCaGenerator.decryptAndVerifyAuthorizationRequestMessage(authRequestMessage,
                 true, // Expect AuthorizationRequestPOP content
                 authorizationCAReceipients); // Receivers able to decrypt the message
        // The AuthorizationRequestData contains the innerAtRequest and calculated requestHash
        InnerAtRequest innerAtRequest = authRequestResult.getValue();
        // There exists another method to decrypt (if privacy is used) and verify inner ecSignature with:
        VerifyResult<EcSignature> ecSignatureVerifyResult = messagesCaGenerator.decryptAndVerifyECSignature(innerAtRequest.getEcSignature(),
                innerAtRequest.getSharedAtRequest(),
                true,
                enrolCredCertStore, // Certificate store to verify the signing enrollment credential
                trustStore,
                enrolCAReceipients); // the EA certificate used to decrypt the inner message.

        // The verified and decrypted (if withPrivacy) eCSignature is retrived with
        EcSignature ecSignature = ecSignatureVerifyResult.getValue();
```

### AuthorizationResponseMessage

To generate and verify AuthorizationResponseMessage

```
        // First create innerAtResponse
        InnerAtResponse innerAtResponse = new InnerAtResponse(authRequestResult.getRequestHash(),
                AuthorizationResponseCode.ok,
                authTicketCert);
        EtsiTs103097DataEncryptedUnicast authResponseMessage = messagesCaGenerator.genAuthorizationResponseMessage(
                new Time64(new Date()), // generation Time
                innerAtResponse,
                authorizationCAChain, // The AA certificate chain signing the message
                authorizationCASignKeys.getPrivate(),
                SymmAlgorithm.aes128Ccm, // Encryption algorithm used.
                authRequestResult.getSecretKey()); // The symmetric key generated in the request.

        
        // To verify AuthorizationResponse use:
        
        // Build reciever store containing the symmetric key used in the request.
        Map<HashedId8, Receiver> authTicketSharedKeyReceivers = messagesCaGenerator.buildRecieverStore(new Receiver[] {new PreSharedKeyReceiver(authRequestResult.getSecretKey())});
        Map<HashedId8, Certificate> authCACertStore = messagesCaGenerator.buildCertStore(authorizationCAChain);
        VerifyResult<InnerAtResponse> authResponseResult = messagesCaGenerator.decryptAndVerifyAuthorizationResponseMessage(authResponseMessage,
                authCACertStore, // certificate store containing certificates for auth cert.
                trustStore,
                authTicketSharedKeyReceivers);
```

### AuthorizationValidationRequestMessage

To generate and verify AuthorizationValidationRequestMessage

```
        // The authorization validation request is sent between AA and EA and should
        // contain the SharedATRequest and ecSignature structures.
        AuthorizationValidationRequest authorizationValidationRequest = new AuthorizationValidationRequest(
                innerAtRequest.getSharedAtRequest(),innerAtRequest.getEcSignature());

        EtsiTs103097DataEncryptedUnicast authorizationValidationRequestMessage = messagesCaGenerator.genAuthorizationValidationRequest(
                new Time64(new Date()), // generation Time
                authorizationValidationRequest,
                authorizationCAChain,// The AA certificate chain to generate the signature.
                authorizationCASignKeys.getPrivate(), // The AA signing keys
                enrolmentCACert); // The EA certificate to encrypt data to.

         
         // To verify an Authorization Validation Request
         
        RequestVerifyResult<AuthorizationValidationRequest> authorizationValidationRequestVerifyResult = messagesCaGenerator.decryptAndVerifyAuthorizationValidationRequestMessage(
                 authorizationValidationRequestMessage,
                 authCACertStore, // certificate store containing certificates for auth cert.
                 trustStore,
                 enrolCAReceipients);
```

### AuthorizationValidationResponseMessage

To generate and verify AuthorizationValidationResponseMessage

```
         // First generate inner authorizationValidationResponse object
        AuthorizationValidationResponse authorizationValidationResponse = new AuthorizationValidationResponse(
                authorizationValidationRequestVerifyResult.getRequestHash(),
                AuthorizationValidationResponseCode.ok,
                genDummyConfirmedSubjectAttributes());
        EtsiTs103097DataEncryptedUnicast authorizationValidationResponseMessage = messagesCaGenerator.genAuthorizationValidationResponseMessage(
                new Time64(new Date()), // generation Time
                authorizationValidationResponse,
                enrollmentCAChain, // EA signing chain
                enrolCASignKeys.getPrivate(), // EA signing private key
                SymmAlgorithm.aes128Ccm, // Encryption algorithm used.
                authorizationValidationRequestVerifyResult.getSecretKey() // The symmetric key generated in the request.
                );

        
        // To verify an Authorization Validation Response
        
        Map<HashedId8, Receiver> authValidationSharedKeyReceivers = messagesCaGenerator.buildRecieverStore(new Receiver[] {new PreSharedKeyReceiver(authorizationValidationRequestVerifyResult.getSecretKey())});
        VerifyResult<AuthorizationValidationResponse> authorizationValidationResponseVerifyResult = messagesCaGenerator.decryptAndVerifyAuthorizationValidationResponseMessage(
                authorizationValidationResponseMessage,
                enrolCACertStore,
                trustStore,
                authValidationSharedKeyReceivers);
```

### Generate CTL and CRL messages

To generate and verify CTL and CRL messages use:

```
        // The messages CertificateRevocationListMessage, TlmCertificateTrustListMessage and RcaCertificateTrustListMessage
        // are all generated using very similar methods. Only CertificateRevocationListMessage is shown here.

        // First generate to be signed data
        ToBeSignedCrl toBeSignedCrl = genDummyCRLToBeSignedData();
        EtsiTs103097DataSigned certificateRevocationListMessage = messagesCaGenerator.genCertificateRevocationListMessage(
                new Time64(new Date()), // signing generation time
                toBeSignedCrl,
                new EtsiTs103097Certificate[]{rootCACert}, // certificate chain of signer
                rootCAKeys.getPrivate()); // Private key of signer

        // To verify CTL and CRL messages
        Map<HashedId8, Certificate> crlTrustStore = new HashMap<>(); // Only root ca needed from truststore in this case.
        VerifyResult<ToBeSignedCrl> crlVerifyResult = messagesCaGenerator.verifyCertificateRevocationListMessage(
                certificateRevocationListMessage,
                crlTrustStore,
                trustStore
        );
```

### CARequestMessage and Rekey

To generate and verify inital and rekey a CARequestMessage use:

```
        // First generate inner CaCertificatRequest
        CaCertificateRequest caCertificateRequest = genDummyCaCertificateRequest(authorizationCASignKeys.getPublic());
        // The self sign the message to prove possession.
        EtsiTs103097DataSigned caCertificateRequestMessage = messagesCaGenerator.genCaCertificateRequestMessage(
                new Time64(new Date()), // signing generation time
                caCertificateRequest,
                authorizationCASignKeys.getPublic(), // The CAs signing keys
                authorizationCASignKeys.getPrivate());

       // To verify a CA Request Message

        VerifyResult<CaCertificateRequest> caCertificateRequestVerifyResult = messagesCaGenerator.verifyCACertificateRequestMessage(caCertificateRequestMessage);

        // To generate a Rekey CA Request Message
        CaCertificateRequest caCertificateRekeyRequest = genDummyCaCertificateRequest(authorizationCAReSignKeys.getPublic());
        EtsiTs103097DataSigned caCertificateRekeyRequestMessage =messagesCaGenerator.genCaCertificateRekeyingMessage(
                new Time64(new Date()), // signing generation time,
                caCertificateRekeyRequest,
                authorizationCAChain,
                authorizationCASignKeys.getPrivate(),
                authorizationCAReSignKeys.getPublic(),
                authorizationCAReSignKeys.getPrivate());

        // To Verify a Rekey CA Request Message
        VerifyResult<CaCertificateRequest> caCertificateRekeyRequestVerifyResult = messagesCaGenerator.verifyCACertificateRekeyingMessage(caCertificateRekeyRequestMessage,authCACertStore,trustStore);
```

# US Standard IEEE 1609.2

The implementation supports the following:

- Encodes using ASN.1 COER
- Support for both ecdsaNistP256 and ecdsaBrainpoolP256r1 algorithm schemes 
- Generation of RootCA, Enrollment CA (Long Term) and Authorization (Short Term) CA
- Generation of Enrollment Certificates and Authorization Certificate
- Support for both explicit and implicit certificate generation
- Support signing and encryption of SecuredData structures
- Generation of SecuredCRL structures.

_Important_: The encryption scheme hasn't been properly tested for inter-operability yet and might contain wrong ECIES parameters.

## Example Code 

Full example code can be seen in src/test/java/org/certificateservices/custom/c2x/demo it contains demo of both ITS (EU) and IEEE (US) standards.

Before doing anything else you need to initialize a CryptoManager used for all cryptographic operations.

```

	    Ieee1609Dot2CryptoManager cryptoManager = new DefaultCryptoManager();	
	    // Initialize the crypto manager to use soft keys using the bouncy castle cryptographic provider.
	    cryptoManager.setupAndConnect(new DefaultCryptoManagerParams("BC"));
	    
```

### Root CA

Example code on how to generate Root a CA, use the AuthorityCertGenerator:

```

	    // Create an authority certificate generator and initialize it with the crypto manager. 
	    AuthorityCertGenerator authorityCertGenerator = new AuthorityCertGenerator(cryptoManager);
	    
	    // Generate a reference to the Root CA Keys	    
	    KeyPair rootCASigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    KeyPair rootCAEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    
	    CertificateId rootCAId = new CertificateId(new Hostname("Test RootCA"));
	    ValidityPeriod rootCAValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 45);
	    List<Integer> countries = new ArrayList<Integer>();
	    countries.add(SWEDEN);
		GeographicRegion region = GeographicRegion.generateRegionForCountrys(countries);
		
	    // Generate the root CA Certificate, without any encryption keys or geographic region.
	    Certificate rootCACertificate = authorityCertGenerator.genRootCA(rootCAId, // CertificateId
	    		rootCAValidityPeriod, //ValidityPeriod
	    		region, //GeographicRegion
	    		4, // assuranceLevel 
                3, // confidenceLevel 
                3, // minChainDepth
                -1, // chainDepthRange
	    		SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
	    		rootCASigningKeys.getPublic(), // signPublicKey
	    		rootCASigningKeys.getPrivate(), // signPrivateKey
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256,  // encPublicKeyAlgorithm
	    		rootCAEncryptionKeys.getPublic()); // encPublicKey
	    		
```

### Enrollment CA (Long Term)

To generate an Enrollment CA:

```

	    // Generate a reference to the Enrollment CA Keys	    
	    KeyPair enrollmentCASigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    KeyPair enrollmentCAEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    
	    CertificateId enrollmentCAId = new CertificateId(new Hostname("Test Enrollment CA"));
	    ValidityPeriod enrollmentCAValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 37);
	    
		byte[] cracaid = Hex.decode("010203"); // Some cracaid
		PsidSspRange[] subjectPerms = new PsidSspRange[1];
		subjectPerms[0] = new PsidSspRange(new Psid(5), new SspRange(SspRangeChoices.all, null)); // Insert proper subject permissions here.
	    // Generate a reference to the Enrollment CA Signing Keys
	    Certificate enrollmentCACertificate =authorityCertGenerator.genLongTermEnrollmentCA(
	    		CertificateType.explicit, // Implicit or Explicit certificate
	    		enrollmentCAId,// CertificateId
				enrollmentCAValidityPeriod, 
				region,  //GeographicRegion
				subjectPerms,
				cracaid,
				99, // CrlSeries
	    		4, // assuranceLevel 
                3, // confidenceLevel 
                2, // minChainDepth
                0, // chainDepthRange
                SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
                enrollmentCASigningKeys.getPublic(), // signPublicKey, i.e public key in certificate
				rootCACertificate, // signerCertificate
				rootCASigningKeys.getPublic(), // signCertificatePublicKey, must be specified separately to support implicit certificates.
				rootCASigningKeys.getPrivate(),
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256,  // encPublicKeyAlgorithm
	    		enrollmentCAEncryptionKeys.getPublic() // encryption public key
	    		);
	    		
```

### Authorization CA (Short Term)

To generate an Authorization CA:

```
        
        // Generate a reference to the Authorization CA Keys
	    KeyPair authorityCASigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    KeyPair authorityCAEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    
	    CertificateId authorityCAId = new CertificateId(new Hostname("Test Enrollment CA"));
	    ValidityPeriod authorityCAValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 15);
	    
		cracaid = Hex.decode("040506"); // Some cracaid
		subjectPerms = new PsidSspRange[1];
		subjectPerms[0] = new PsidSspRange(new Psid(6), new SspRange(SspRangeChoices.all, null)); // Insert proper subject permissions here.

	    // Generate a reference to the Authorization CA Signing Keys
	    Certificate authorityCACertificate = authorityCertGenerator.genAuthorizationCA(
	    		CertificateType.explicit, // Implicit or Explicit certificate
	    		authorityCAId,// CertificateId
	    		authorityCAValidityPeriod, 
				region,  //GeographicRegion
				subjectPerms,
				cracaid,
				99, // Some CrlSeries
	    		4, // assuranceLevel 
                3, // confidenceLevel 
                2, // minChainDepth
                0, // chainDepthRange
                SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
                authorityCASigningKeys.getPublic(), // signPublicKey, i.e public key in certificate
				rootCACertificate, // signerCertificate
				rootCASigningKeys.getPublic(), // signCertificatePublicKey,
				rootCASigningKeys.getPrivate(),
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256,  // encPublicKeyAlgorithm
	    		authorityCAEncryptionKeys.getPublic() // encryption public key
	    		);
	    		
```


### Enrollment Certificate

To create an Enrollment Certificate (explicit in this example) use the EnrollmentCertGenerator.

```

	    // Now we have the CA hierarchy, the next step is to generate an enrollment credential
	    // First we create a Enrollment Credential Cert Generator using the newly created Enrollment CA.
	    EnrollmentCertGenerator enrollmentCredentialCertGenerator = new EnrollmentCertGenerator(cryptoManager);
	    // Next we generate keys for an enrollment credential.
	    KeyPair enrollmentCredentialSigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    // Next we generate keys for an enrollment credential.
	    KeyPair enrollmentCredentialEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);

	    CertificateId enrollCertId = new CertificateId(Hex.decode("0102030405060708"));
	    ValidityPeriod enrollCertValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 35);
	    
		PsidSspRange[] certRequestPermissions = new PsidSspRange[1];
		certRequestPermissions[0] = new PsidSspRange(new Psid(5), new SspRange(SspRangeChoices.all, null)); // Insert proper subject permissions here.
	    
	    // Then use the following command to generate a enrollment credential
	    Certificate enrollmentCredential = enrollmentCredentialCertGenerator.genEnrollCert(
	    		CertificateType.explicit, // Implicit or Explicit certificate
	    		enrollCertId, // Certificate Id,
	    		enrollCertValidityPeriod, 
	    		region, 
	    		certRequestPermissions, 
	    		cracaid, // insert proper cracaid here.
	    		99, // Some CrlSeries
	    		4, 
	    		3, 
	    		SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
	    		enrollmentCredentialSigningKeys.getPublic(), // signPublicKey, i.e public key in certificate
	    		enrollmentCACertificate, // signerCertificate
	    		enrollmentCASigningKeys.getPublic(), // signCertificatePublicKey,
	    		enrollmentCASigningKeys.getPrivate(), 
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm 
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256, // encPublicKeyAlgorithm
	    		enrollmentCredentialEncryptionKeys.getPublic() // encryption public key
	    		);
	    		
```

### Authorization Certificate (With implicit certificate)

To create an Authorization Certificate (implicit in this example) use the AuthorizationCertGenerator.

```

	    // Authorization certificates are created by the AuthorizationCertGenerator
	    AuthorizationCertGenerator authorizationCertGenerator = new AuthorizationCertGenerator(cryptoManager);
	    
	    // Next we generate keys for an authorization certificate.
	    KeyPair authorizationCertRequestSigningKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    
	    // Next we generate keys for an authorization certificate.
	    KeyPair authorizationCertEncryptionKeys = cryptoManager.generateKeyPair(SignatureChoices.ecdsaNistP256Signature);
	    
	    CertificateId authorizationCertId = new CertificateId(Hex.decode("9999999999"));
	    ValidityPeriod authorizationCertValidityPeriod = new ValidityPeriod(new Date(), DurationChoices.years, 35);
	    
	    
		PsidSsp[] appPermissions = new PsidSsp[1];
		appPermissions[0] = new PsidSsp(new Psid(6), null); // Insert proper app permissions here.
	    
	    // Generate a certificate as an implicit certificate.
	    Certificate authorizationCert = authorizationCertGenerator.genAuthorizationCert(
	    		CertificateType.implicit, // Implicit or Explicit certificate
	    		authorizationCertId, // Certificate Id,
	    		authorizationCertValidityPeriod, 
	    		region, 
	    		appPermissions, 
	    		cracaid, // insert proper cracaid here.
	    		99, // Some CrlSeries
	    		4, 
	    		3, 
	    		SignatureChoices.ecdsaNistP256Signature, //signingPublicKeyAlgorithm
	    		authorizationCertRequestSigningKeys.getPublic(), // signPublicKey, i.e public key in certificate
	    		authorityCACertificate, // signerCertificate
	    		authorityCASigningKeys.getPublic(), // signCertificatePublicKey,
	    		authorityCASigningKeys.getPrivate(), 
	    		SymmAlgorithm.aes128Ccm, // symmAlgorithm 
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256, // encPublicKeyAlgorithm
	    		authorizationCertEncryptionKeys.getPublic() // encryption public key
	    		); 
	    
	    // Implicit certificate needs to have it's private key reconstructed. R is given inside the ImplicitCertificateData (which is the actual type of implicit certificates)
	    PrivateKey authorizationCertSigningPrivateKey = cryptoManager.reconstructImplicitPrivateKey(authorizationCert, 
	    		((ImplicitCertificateData) authorizationCert).getR(), 
	    		SignatureChoices.ecdsaNistP256Signature, 
	    		authorizationCertRequestSigningKeys.getPrivate(), authorityCASigningKeys.getPublic(),
	    		authorityCACertificate);
	    		
```

### Certificate Encoding and Decoding Example 

To encode and decode a certificate use:
		
```

	    // To encode a certificate to a byte array use the following method
	    byte[] certificateData = authorizationCert.getEncoded();
	    
	    // To decode certificate data use the following constructor
	    Certificate decodedCertificate = new Certificate(certificateData);

```

### Secured Data Example

To generate signed and/or encrypted Secured Data use the SecuredMessageGenerator:

```

	    // Secure Messages are created by the Secure Message Generator
	    SecuredDataGenerator securedMessageGenerator = new SecuredDataGenerator(SecuredDataGenerator.DEFAULT_VERSION, cryptoManager, HashAlgorithm.sha256, SignatureChoices.ecdsaNistP256Signature);
	    
	    // It is then possible to create a signed message with the following code
	      // First generate a Header with
	    HeaderInfo hi = securedMessageGenerator.genHeaderInfo(
	    		123L, // psid Required, 
	    		null, // generationTime Optional
	    		null, // expiryTime Optional
	    		null, // generationLocation Optional
	    		null, // p2pcdLearningRequest Optional
	    		null, // cracaid Optional
	    		null, // crlSeries Optional 
	    		null, // encType Type of encryption when encrypting a message with a encryption key references in a signed message instead of a certificate. Optional
	    		null, // encryptionKey Optional
				null, // inlineP2pcdRequest Optional
		null // requestedCertificate Optional
	    		);
	    
	    // This method can be used to sign the data
	    Ieee1609Dot2Data signedData = securedMessageGenerator.genSignedData(hi, 
	    		"TestData".getBytes(), // The actual payload message to sign. 
	    		SignerIdentifierType.HASH_ONLY, // One of  HASH_ONLY, SIGNER_CERTIFICATE, CERT_CHAIN indicating reference data of the signer to include in the message
	    		new Certificate[] {authorizationCert,authorityCACertificate, rootCACertificate}, // The chain is required even though it isn't included in
	    		  // the message if eventual implicit certificates need to have it's public key reconstructed.
	    		authorizationCertSigningPrivateKey); // Signing Key
	    
	    // The message can be encrypted with the method
	      // First construct a list of recipient which have the public key specified either as a symmetric key, certificate or in header of signed data
	      // In this example we will use certificate as reciever, see package org.certificateservices.custom.c2x.ieee1609dot2.generator.recipient for more details.
	    Ieee1609Dot2Data encryptedData = securedMessageGenerator.encryptData(BasePublicEncryptionKeyChoices.ecdsaNistP256, 
	    		  signedData.getEncoded(), new Recipient[] {new CertificateRecipient(enrollmentCredential)});
	      // It is also possible to encrypt using a pre shared key using the encryptDataWithPresharedKey() method.
	    
	    // It is also possible to sign and encrypt in one go.
	    byte[] encryptedAndSignedMessage = securedMessageGenerator.signAndEncryptData(hi, 
	    		"TestData2".getBytes(), 
	    		SignerIdentifierType.HASH_ONLY, 
	    		new Certificate[] {authorizationCert,authorityCACertificate, rootCACertificate}, 
	    		authorizationCertSigningPrivateKey, // Important to use the reconstructed private key for implicit certificates
	    		BasePublicEncryptionKeyChoices.ecdsaNistP256, 
	    		new Recipient[] {new CertificateRecipient(enrollmentCredential)}).getEncoded();
	    
	    // To decrypt and verify a signed message it is possible to use the following
	      // First build a truststore of trust anchors (root CA certificate or equivalent)
	    Map<HashedId8, Certificate> trustStore = securedMessageGenerator.buildCertStore(new Certificate[] {rootCACertificate});
	      // Second build a store of known certificate that might be referenced in the message.
	    Map<HashedId8, Certificate> certStore = securedMessageGenerator.buildCertStore(new Certificate[] {authorizationCert, authorityCACertificate});
	      // To decrypt build a reciever store of known decryption keys and related receiver info, this can be certificate, signed message containing encryption key
	      // in header, symmetric key or pre shared key.
	    Map<HashedId8, Receiver> recieverStore = securedMessageGenerator.buildRecieverStore(new Receiver[] { new CertificateReciever(enrollmentCredentialEncryptionKeys.getPrivate(), enrollmentCredential)});
		  // Finally perform the decryption with.
		DecryptAndVerifyResult decryptAndVerifyResult = securedMessageGenerator.decryptAndVerifySignedData(encryptedAndSignedMessage,
	    		certStore, 
	    		trustStore,
	    		recieverStore, 
	    		true, //requiredSignature true if message must be signed otherwise a IllegalArgument is throwm
	    		true //requireEncryption true if message must be encrypted otherwise a IllegalArgument is throwm
	    		);
		   // The decryptAndVerifyResult contains the inner opaque data, the related header info and signer identifier
		   // if related message was signed.

	      // It is also possible to use the methods decryptData or verifySignedData (or verifyReferencedSignedData) for alternative methods to verify and decrypt messages.

```

### Secured Data Encoding and Decoding Example 


To encode and decode a secured data use:
		
```

	    // To encode a secured message to a byte array use the following method.
	    byte[] messageData = signedData.getEncoded();
	    
	    // To decode message data use the following constructor.
	    Ieee1609Dot2Data decodedMessage = new Ieee1609Dot2Data(messageData);

```
