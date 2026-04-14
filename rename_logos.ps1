$logoDir = "logo"
$targetDir = "public/logos"

if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force }

Get-ChildItem $logoDir | ForEach-Object {
    $targetName = ""

    if ($_.Extension -eq ".svg") { $targetName = "concord.svg" }
    elseif ($_.Extension -eq ".jpg") {
        if ($_.Length -gt 100KB) { $targetName = "tricorn.jpg" }
        else { $targetName = "coke.jpg" }
    }
    elseif ($_.Extension -eq ".png") {
        if ($_.Length -gt 150KB) { $targetName = "grapeking.png" }
        elseif ($_.Length -gt 40KB) { $targetName = "kedge.png" }
        else { $targetName = "kyf.png" }
    }

    if ($targetName -ne "") {
        Copy-Item $_.FullName "$targetDir/$targetName" -Force
        Write-Host "Copied $($_.Name) to $targetName (Size: $($_.Length))"
    }
}
