$title = "Scenes"
$sceneWin = WinGetHandle("Scenes")
$chaseWin = WinGetHandle("Chases")
;ControlListView($hwd, "", "JinxList1", "Select", 2)
ControlClick($sceneWin, "", "JinxList1", "left", 1, 0, 35)
Sleep(60000)
ControlClick($chaseWin, "", "JinxButton2")
Exit