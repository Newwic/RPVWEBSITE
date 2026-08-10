param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'

$sourceDir = Join-Path $ProjectRoot 'assets\itopplus\images'
$oldDir = Join-Path $ProjectRoot 'assets\rpv-watermarked'
$outputDir = Join-Path $ProjectRoot 'assets\rpv-watermarked-pattern'
$ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source
$ffprobe = (Get-Command ffprobe -ErrorAction Stop).Source
$fontFile = 'C\:/Windows/Fonts/georgiab.ttf'
$additionalSourceNames = @(
  'Screenshot2024-06-18133652z-z181602969884-934d1b8a39.webp',
  'image-Photoroom-6-z-z449893161938-e7edeee5f2.png',
  'GBSandz-z1506707535607-3ac278e469.webp',
  'PolishingMediaz-z119638418684-8589fbfcdd.webp',
  'BowlFeederz-z705132466308-d9974ce643.webp',
  'ServiceRepairz-z1108734234555-def29d64e2.webp'
)

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

function Get-ImageSize([string]$path) {
  $size = (& $ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x $path 2>$null).Trim()
  if ($LASTEXITCODE -ne 0 -or $size -notmatch '^(\d+)x(\d+)$') {
    throw "Could not read image dimensions: $path"
  }

  return [int[]]@($Matches[1], $Matches[2])
}

function Get-WatermarkFilter([int]$width, [int]$height) {
  $boxWidth = [Math]::Max(72, [Math]::Min([int]($width * 0.26), [int]($height * 0.46)))
  $boxHeight = [Math]::Max(26, [int]($boxWidth * 0.352))
  $fontSize = [Math]::Max(20, [int]($boxWidth * 0.31))
  $smallFontSize = [Math]::Max(8, [int]($boxWidth * 0.055))
  $stroke = [Math]::Max(2, [int]($boxWidth * 0.012))

  $leftX = [int]($width * 0.06)
  $rightX = [Math]::Max(0, $width - $boxWidth - [int]($width * 0.06))
  $centerX = [int](($width - $boxWidth) / 2)
  $topY = [int]($height * 0.08)
  $middleY = [int](($height - $boxHeight) / 2)
  $bottomY = [Math]::Max(0, $height - $boxHeight - [int]($height * 0.08))

  $marks = @(
    @($leftX, $topY),
    @($rightX, $topY),
    @($centerX, $middleY),
    @($leftX, $bottomY),
    @($rightX, $bottomY)
  )

  $filters = foreach ($mark in $marks) {
    $x = $mark[0]
    $y = $mark[1]
    $textX = "$x+($boxWidth-text_w)/2"
    $textY = "$y+($boxHeight-text_h)/2-($smallFontSize*0.12)"
    $smallX = "$x+($boxWidth-text_w)/2"
    $smallY = "$y+$boxHeight-($smallFontSize*1.35)"

    "drawbox=x=${x}:y=${y}:w=${boxWidth}:h=${boxHeight}:t=${stroke}:color=0x8c9690@0.22"
    "drawtext=fontfile='${fontFile}':text='RPV':fontcolor=0x9bd39b@0.38:fontsize=${fontSize}:x=${textX}:y=${textY}"
    "drawtext=fontfile='${fontFile}':text='RPV.CO.TH':fontcolor=0x769b78@0.30:fontsize=${smallFontSize}:x=${smallX}:y=${smallY}"
  }

  return $filters -join ','
}

$files = @(Get-ChildItem -LiteralPath $oldDir -File -Filter 'rpv-*' | Sort-Object Name)
if ($files.Count -eq 0) {
  throw "No product image list found in $oldDir"
}

$sourceNames = @(
  $files | ForEach-Object { $_.Name.Substring(4) }
  $additionalSourceNames
) | Sort-Object -Unique

$generated = 0
$missing = @()

foreach ($sourceName in $sourceNames) {
  $sourcePath = Join-Path $sourceDir $sourceName
  if (-not (Test-Path -LiteralPath $sourcePath)) {
    $missing += $sourceName
    continue
  }

  $size = Get-ImageSize $sourcePath
  $filter = Get-WatermarkFilter $size[0] $size[1]
  $outputName = "rpv-$sourceName"
  $outputPath = Join-Path $outputDir $outputName
  $tempPath = "$outputPath.tmp$([IO.Path]::GetExtension($sourceName))"

  if (Test-Path -LiteralPath $tempPath) {
    Remove-Item -LiteralPath $tempPath -Force
  }

  $extension = [IO.Path]::GetExtension($sourceName).ToLowerInvariant()
  $codecArgs = switch ($extension) {
    '.webp' { @('-c:v', 'libwebp', '-q:v', '82') }
    '.jpg'  { @('-c:v', 'mjpeg', '-q:v', '2') }
    '.jpeg' { @('-c:v', 'mjpeg', '-q:v', '2') }
    '.png'  { @('-c:v', 'png') }
    default { @('-c:v', 'libwebp', '-q:v', '82') }
  }

  & $ffmpeg -hide_banner -loglevel error -y -i $sourcePath -vf $filter -frames:v 1 @codecArgs $tempPath
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $tempPath)) {
    throw "Watermark generation failed: $sourceName"
  }

  Move-Item -LiteralPath $tempPath -Destination $outputPath -Force
  $generated++
}

Write-Output "Generated $generated new watermarked images: $outputDir"
if ($missing.Count -gt 0) {
  Write-Warning ("Missing {0} source images: {1}" -f $missing.Count, ($missing -join ', '))
}
