/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
describe('TP-Token', function () {
  let Tptoken, tptoken, Tptico, tptico, dev, owner, alice, bob, eve;
  const NAME = 'tptoken';
  const NAME_ICO = 'Tptico';
  const SYMBOL = 'TPC';
  const INITIAL_SUPPLY = ethers.utils.parseEther('8000000000');
  this.beforeEach(async function () {
    [dev, owner, alice, bob, eve] = await ethers.getSigners();
    Tptoken = await ethers.getContractFactory('Tptoken');
    tptoken = await Tptoken.connect(dev).deploy(NAME, SYMBOL, INITIAL_SUPPLY);
    await tptoken.deployed();
  });
  describe('Deployement', function () {
    it('Test deploy ownable event', async function () {
      await expect(tptoken.deployTransaction)
        .to.emit(tptoken, 'OwnershipTransferred')
        .withArgs(ethers.constants.AddressZero, dev.address);
    });
  });
  describe('Functions', function () {
    describe('owner', function () {
      it('Should return owner', async function () {
        expect(await tptoken.owner()).to.equal(dev.address);
      });
    });
    describe('totalSupply', function () {
      it('Should return totalSupply', async function () {
        expect(await tptoken.totalSupply()).to.equal(ethers.utils.parseEther('8000000000'));
      });
    });
    describe('balanceOf', function () {
      it('Should return balance of owner', async function () {
        expect(await tptoken.connect(dev).balanceOf(dev.address)).to.equal(ethers.utils.parseEther('8000000000'));
      });
    });
    describe('approval', function () {
      it('approve', async function () {
        Tptico = await ethers.getContractFactory('Tptico');
        tptico = await Tptico.connect(dev).deploy(tptoken.address, NAME_ICO);
        await tptico.deployed();
        await tptoken.approve(tptico.address, ethers.utils.parseEther('2000000000'));
        expect(await tptoken.allowance(dev.address, tptico.address)).to.equal(ethers.utils.parseEther('2000000000'));
      });
    });
  });
});
