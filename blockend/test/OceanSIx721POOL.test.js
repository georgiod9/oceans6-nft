const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

// chai assert 
const { assert } = chai;

// chai promises
chai.use(chaiAsPromised);

const { toTokens } = require("../utils/test-utils")(web3);

//load contract artifact
const StakeHoldersPoolCont = artifacts.require("StakeHoldersPool");

contract("StakeHoldersPool", ([a1, a2, a3, ...others]) => {
    let funds;

    //init contract instance for test session
    before(async () => {
        pool = await StakeHoldersPoolCont.deployed();
    });

    describe("Contract deployment", async () => {
        it("Payee 0 is a1", async () => {
            let payee0 = await pool.payee(0);
            assert.equal(payee0, a1);
        });
        
        it("Payee 1 is a2", async () => {
            let payee1 = await pool.payee(1);
            assert.equal(payee1, a2);
        });
        
        it("Funding contract Stake holders pool should receive eth balance", async () => {
            await pool.send(toTokens("8"), {from: a1});
            assert.equal(
                await web3.eth.getBalance(pool.address),
                toTokens("8")
            );
        });
    });

    describe("Claiming funds", async () => {
        it("Payee Claiming his shares from minting", async () => {
          const a2prebal = await web3.eth.getBalance(a2);
          const a2due = Number(await pool.getDuePayment(a2));
          await pool.release(a2);
          const a2bal = await web3.eth.getBalance(a2);
          const a2postdue = Number(await pool.getDuePayment(a2));
          assert.equal(Number(a2due) + Number(a2prebal), Number(a2bal));
          assert.equal(a2postdue, 0);
        });
    
        it("Payee Claiming his already-claimed share should fail", async () => {
          await pool
            .release(a2)
            .then(() => {
              assert.fail("account was able to release more than due");
            })
            .catch(() => {
              assert.ok("account was not able to releas un-due funds");
            });
        });
      });



});