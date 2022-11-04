#!/bin/bash
tee ()
{
  test ${#} -eq 1 || return;
  sed "w ${1}" -
}
main ()
{
  seq 10 | tee ten;
  cat ten
}
main