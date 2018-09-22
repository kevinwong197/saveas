pushd saveas-win32-x64
set "PATH=C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\bin\amd64;%PATH%"
editbin /subsystem:console saveas.exe
mkdir bin
copy ..\bin\saveas.bat .\bin\saveas.bat
popd