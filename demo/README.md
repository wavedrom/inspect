## serv

```bash
cd olofk/serv
verilator -Irtl rtl/*.v --xml-only --xml-output top.xml
```

## rocket-chip

```bash
cd chipsalliance/rocket-chip

export RISCV=/home/drom/work/github/riscv/riscv-gnu-toolchain/

cd vsim
make verilog

verilator \
generated-src/freechips.rocketchip.system.DefaultConfig.v \
generated-src/freechips.rocketchip.system.DefaultConfig/plusarg_reader.v \
generated-src/freechips.rocketchip.system.DefaultConfig.behav_srams.v \
../src/main/resources/vsrc/EICG_wrapper.v \
../src/main/resources/vsrc/SimDTM.v \
--xml-only --xml-output top.xml
```

## swerv

```bash
cd chipsalliance/Cores-SweRV

export RV_ROOT=/home/drom/work/github/chipsalliance/Cores-SweRV/

./configs/swerv.config -dccm_size=64

make -f $RV_ROOT/tools/Makefile

verilator --cc -CFLAGS "-std=c++11" \
snapshots/default/common_defines.vh \
/home/drom/work/github/chipsalliance/Cores-SweRV//design/include/swerv_types.sv \
-I/home/drom/work/github/chipsalliance/Cores-SweRV//design/include \
-I/home/drom/work/github/chipsalliance/Cores-SweRV//design/lib \
-Isnapshots/default \
-Wno-UNOPTFLAT \
-I/home/drom/work/github/chipsalliance/Cores-SweRV//testbench \
-f /home/drom/work/github/chipsalliance/Cores-SweRV//testbench/flist \
/home/drom/work/github/chipsalliance/Cores-SweRV//testbench/tb_top.sv \
/home/drom/work/github/chipsalliance/Cores-SweRV//testbench/ahb_sif.sv \
--top-module tb_top \
-exe test_tb_top.cpp \
--autoflush \
--xml-only --xml-output top.xml
```
