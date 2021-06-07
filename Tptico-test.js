/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');

describe('TP-Token and TP-ICO', function () {
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
  describe('Deployement', function () {
    it('Test deploy ownable event', async function () {
      await expect(tptoken.deployTransaction)
        .to.emit(tptoken, 'OwnershipTransferred')
        .withArgs(ethers.constants.AddressZero, dev.address);
    });
  });
  describe('Tptoken', function () {
    describe('name', function () {
      it('name', async function () {
        expect(await tptico.name()).to.equal(NAME);
      });
    });
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
        await tptoken.approve(tptico.address, ethers.utils.parseEther('2000000000'));
        expect(await tptoken.allowance(dev.address, tptico.address)).to.equal(ethers.utils.parseEther('2000000000'));
      });
    });
    describe('ICO contract', function () {
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
          await expect(tptico.connect(alice).buyTokens({ value: 1 })).to.be.revertedWith(
            'Tptico: no more token to buy'
          );
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






describe('recieve', function () {
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
    await expect(alice.sendTransaction({to:tptico.address,  value: 1 })).to.be.revertedWith('Tptico: sorry the ico is closed');
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
});
