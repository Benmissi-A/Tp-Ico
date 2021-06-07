/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');

describe('TP-Calculator', function () {
  let Tptoken, tptoken, Tptico, tptico, Tpcalculator, tpcalculator, dev, owner, alice, bob, eve;
  const NAME = 'tptoken';
  const NAME_ICO = 'Tptico';
  const SYMBOL = 'TPC';
  const INITIAL_SUPPLY = ethers.utils.parseEther('8000000000');
  this.beforeEach(async function () {
    [dev, owner, alice, bob, eve] = await ethers.getSigners();
    Tptoken = await ethers.getContractFactory('Tptoken');
    tptoken = await Tptoken.connect(dev).deploy(NAME, SYMBOL, INITIAL_SUPPLY);
    await tptoken.deployed();

    Tptico = await ethers.getContractFactory('Tptico');
    tptico = await Tptico.connect(dev).deploy(tptoken.address, NAME_ICO);
    await tptico.deployed();

    Tpcalculator = await ethers.getContractFactory('Tpcalculator');
    tpcalculator = await Tpcalculator.connect(dev).deploy(tptoken.address);
    await tpcalculator.deployed();
  });

  describe('Tp-calculator', function () {
    this.beforeEach(async function () {
      await tptoken.connect(dev).transfer(alice.address, ethers.utils.parseEther('2000000000'));
      await tptoken.connect(alice).approve(tpcalculator.address, ethers.utils.parseEther('2000000000'));
    });
    describe('calculated event', function () {
      it('should emit for add Calculated', async function () {
        await expect(tpcalculator.connect(alice).add(2, 3))
          .to.emit(tpcalculator, 'Calculated')
          .withArgs('add', 2, 3, 5);
      });
      it('should emit for sub Calculated', async function () {
        await expect(tpcalculator.connect(alice).sub(3, 2))
          .to.emit(tpcalculator, 'Calculated')
          .withArgs('sub', 3, 2, 1);
      });
      it('should emit for mul Calculated', async function () {
        await expect(tpcalculator.connect(alice).mul(2, 3))
          .to.emit(tpcalculator, 'Calculated')
          .withArgs('mul', 2, 3, 6);
      });
      it('should emit for div Calculated', async function () {
        await expect(tpcalculator.connect(alice).div(6, 3))
          .to.emit(tpcalculator, 'Calculated')
          .withArgs('div', 6, 3, 2);
      });
      it('should revert with Tpcalculator: can not divide by 0', async function () {
        await expect(tpcalculator.connect(alice).div(6, 0)).to.be.revertedWith('Tpcalculator: can not divide by 0');
      });
      it('should emit for mod Calculated', async function () {
        await expect(tpcalculator.connect(alice).mod(10, 2))
          .to.emit(tpcalculator, 'Calculated')
          .withArgs('mod', 10, 2, 0);
      });
      it('should revert with Tpcalculator: can not divide by 0', async function () {
        await expect(tpcalculator.connect(alice).mod(6, 0)).to.be.revertedWith('Tpcalculator: can not divide by 0');
      });
    });
  });
});
