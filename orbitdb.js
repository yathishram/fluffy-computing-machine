const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')



const init = async() => {

    try{
        const ipfsOptions = { repo : './ipfs', }
        const ipfs = await IPFS.create(ipfsOptions)
        const orbitdb = await OrbitDB.createInstance(ipfs)
        return orbitdb
    }catch(err){
        console.log(err)
    }
 
}

const createDB = async(orbitdb) => {
    const userDB = await orbitdb.docs('user-doc', {indexBy: '_id'})
    const safeDB = await orbitdb.docs('safe-doc', {indexBy: '_id'})
    console.log(safeDB.address.toString())
    return {userDB, safeDB}
}


// const addUser = async(db) => {
//   const hash = await db.put({_id:"1", name:"Yathish", guardian: false});
//   console.log("user hash", hash)
// }

const main = async() => {


    //step1: Initiate orbitDB
    const oribitDB = await init();

    //step2: Create a DB
    const {userDB, safeDB} = await createDB(oribitDB)


    //Create a document for User info.
    console.log("adding users")
    const user1 = await userDB.put({_id: 1, name: 'Creator', email: "creator@test.com", signupMode: 0, address: "userAddress", guardian: false})
    const user2 = await userDB.put({_id: 2, name: 'beneficiary', email: "beneficiary@test.com", signupMode: 0, address: "userAddress", guardian: false})
    const guardian1 = await userDB.put({_id: 3, name: 'Guardian 1', email: "Guardian 1'@test.com", signupMode: 0, address: "userAddress", guardian: true})
    const guardian2 = await userDB.put({_id: 4, name: 'Guardian 2', email: "guardianTwo@test.com", signupMode: 0, address: "userAddress", guardian: true})
    const guardian3 = await userDB.put({_id: 5, name: 'Guardian 3', email: "guardianThree@test.com", signupMode: 0, address: "userAddress", guardian: true})
    console.log(guardian3)
    console.log("users added")

    console.log("getting users")
    const users = await userDB.get('')
    console.log(users)


    console.log("getting only guardians")
    const guardians = await userDB.query((doc) => doc.guardian === true)
    console.log(guardians)
    

    //adding safe data

    console.log("adding safe data");

    const safe1 = await safeDB.put({
        _id: 1,
        safeName: "Safe 1",
        description: "orbitdb safe",
        creator: "did",
        guardians: ["guardiandid1", "guardiandid1", "guardiandid1"],
        beneficiary: "did",
        encSafeKey: "enckey",
        encSafeData: "buffer data",
        stage: 0,
        encSafeKeyShards: ["shards"],
        decSafeKeyShards: ["decShards"],
        claims: ["claims"],
        onChain: true,
        claimType: 0,
        signalingPeriod: 0,
        dDay: 0,
        timeStamp: 1222222,
        proofSubmission: false,
        cid: "string"
    })

    console.log("safe data fetching")
    const safeData = await safeDB.get('');
    console.log(safeData)
}


main();