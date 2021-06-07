/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');

describe('TP-ICO', function () {
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
    Tptico = await ethers.getContractFactory('Tptico');
    tptico = await Tptico.connect(dev).deploy(tptoken.address, NAME_ICO);
    await tptico.deployed();
  });
  describe('Should return tptoken name', function () {
    it('name', async function () {
      expect(await tptico.name()).to.equal(NAME);
    });
  });
  describe('Functions', function () {
    this.beforeEach(async function () {
      await tptoken.approve(tptico.address, ethers.utils.parseEther('2000000000'));
    });
    describe('buyToken', function () {
      it('should emit Bought', async function () {
        await expect(tptico.connect(alice).buyTokens({ value: ethers.utils.parseEther('0.000000001') }))
          .to.emit(tptico, 'Bought')
          .withArgs(alice.address, ethers.utils.parseEther('1'));
      });
      it('should emit Refunded', async function () {
        await expect(tptico.connect(alice).buyTokens({ value: ethers.utils.parseEther('4') }))
          .to.emit(tptico, 'Refunded')
          .withArgs(alice.address, ethers.utils.parseEther('2'));
      });
      it('should revert with Tptico: no more token to buy', async function () {
        await tptico.connect(bob).buyTokens({ value: ethers.utils.parseEther('2') });
        await expect(tptico.connect(alice).buyTokens({ value: 1 })).to.be.revertedWith('Tptico: no more token to buy');
      });
      it('should revert after time with Tptico: sorry the ico is closed', async function () {
        await ethers.provider.send('evm_increaseTime', [15 * 24 * 3600]);
        await ethers.provider.send('evm_mine');
        await expect(tptico.connect(alice).buyTokens({ value: 1 })).to.be.revertedWith(
          'Tptico: sorry the ico is closed'
        );
      });
      it('should return balanceOf', async function () {
        await tptico.connect(alice).buyTokens({ value: ethers.utils.parseEther('0.000000001') });
        expect(await tptoken.connect(dev).balanceOf(alice.address)).to.equal(ethers.utils.parseEther('1'));
      });
    });
    describe('recieve function', function () {
      it('should emit Bought', async function () {
        await expect(alice.sendTransaction({ to: tptico.address, value: ethers.utils.parseEther('0.000000001') }))
          .to.emit(tptico, 'Bought')
          .withArgs(alice.address, ethers.utils.parseEther('1'));
      });
      it('should emit Refunded', async function () {
        await expect(alice.sendTransaction({ to: tptico.address, value: ethers.utils.parseEther('4') }))
          .to.emit(tptico, 'Refunded')
          .withArgs(alice.address, ethers.utils.parseEther('2'));
      });
      it('should revert with Tptico: no more token to buy', async function () {
        await tptico.connect(bob).buyTokens({ value: ethers.utils.parseEther('2') });
        await expect(alice.sendTransaction({ to: tptico.address, value: 1 })).to.be.revertedWith(
          'Tptico: no more token to buy'
        );
      });
      it('should revert after time with Tptico: sorry the ico is closed', async function () {
        await ethers.provider.send('evm_increaseTime', [15 * 24 * 3600]);
        await ethers.provider.send('evm_mine');
        await expect(alice.sendTransaction({ to: tptico.address, value: 1 })).to.be.revertedWith(
          'Tptico: sorry the ico is closed'
        );
      });
      it('should return balanceOf', async function () {
        await alice.sendTransaction({ to: tptico.address, value: ethers.utils.parseEther('0.000000001') });
        expect(await tptoken.connect(dev).balanceOf(alice.address)).to.equal(ethers.utils.parseEther('1'));
      });
    });

    describe('withdraw', function () {
      it('should emit withdrew', async function () {
        await tptico.connect(alice).buyTokens({ value: ethers.utils.parseEther('1') });
        await ethers.provider.send('evm_increaseTime', [15 * 24 * 3600]);
        await ethers.provider.send('evm_mine');
        await expect(tptico.connect(dev).withdraw())
          .to.emit(tptico, 'Withdrew')
          .withArgs(dev.address, ethers.utils.parseEther('1'));
      });
      it('should revert with Tptico: only owner can withdraw', async function () {
        await ethers.provider.send('evm_increaseTime', [15 * 24 * 3600]);
        await ethers.provider.send('evm_mine');
        await expect(tptico.connect(eve).withdraw()).to.be.revertedWith('Tptico: only owner can withdraw');
      });
      it('should revert before time with Tptico: sorry be more patient ', async function () {
        await expect(tptico.connect(dev).withdraw()).to.be.revertedWith('Tptico: sorry be more patient');
      });
    });
  });
});
