# Quick Setup Script for 3D Avatar Model

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  3D Avatar Model Setup Helper" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$modelPath = "g:\Daksh_Library\Avatar_chatbot\public\models\head.glb"
$modelDir = Split-Path $modelPath -Parent

# Check if model already exists
if (Test-Path $modelPath) {
    Write-Host "✅ Model already exists at:" -ForegroundColor Green
    Write-Host "   $modelPath" -ForegroundColor Yellow
    Write-Host ""
    
    $replace = Read-Host "Do you want to replace it? (y/n)"
    if ($replace -ne "y") {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit
    }
}

Write-Host ""
Write-Host "📦 3D Model Setup Options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ReadyPlayerMe (Recommended - Easiest)" -ForegroundColor Green
Write-Host "   - Takes 5 minutes"
Write-Host "   - High quality with built-in morph targets"
Write-Host "   - Free"
Write-Host ""
Write-Host "2. Download sample model (Quick test)" -ForegroundColor Yellow
Write-Host "   - Instant download"
Write-Host "   - Basic quality for testing"
Write-Host "   - Replace with better model later"
Write-Host ""
Write-Host "3. Manual setup with guide" -ForegroundColor Blue
Write-Host "   - More options (Mixamo, Sketchfab, MakeHuman)"
Write-Host "   - Takes 15-30 minutes"
Write-Host ""

$choice = Read-Host "Choose option (1, 2, or 3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Opening ReadyPlayerMe..." -ForegroundColor Green
        Start-Process "https://readyplayer.me/"
        Write-Host ""
        Write-Host "Instructions:" -ForegroundColor Cyan
        Write-Host "1. Create your avatar (use selfie or customize)" -ForegroundColor White
        Write-Host "2. Click 'Export' and download as GLB format" -ForegroundColor White
        Write-Host "3. Save the downloaded file" -ForegroundColor White
        Write-Host ""
        
        Write-Host "After downloading, press any key to select the file..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        
        Add-Type -AssemblyName System.Windows.Forms
        $openFileDialog = New-Object System.Windows.Forms.OpenFileDialog
        $openFileDialog.Filter = "GLB files (*.glb)|*.glb|All files (*.*)|*.*"
        $openFileDialog.Title = "Select your downloaded ReadyPlayerMe GLB file"
        
        if ($openFileDialog.ShowDialog() -eq 'OK') {
            $sourcePath = $openFileDialog.FileName
            
            # Ensure directory exists
            if (-not (Test-Path $modelDir)) {
                New-Item -ItemType Directory -Path $modelDir -Force | Out-Null
            }
            
            # Copy file
            Copy-Item -Path $sourcePath -Destination $modelPath -Force
            Write-Host ""
            Write-Host "✅ Model installed successfully!" -ForegroundColor Green
            Write-Host "   Location: $modelPath" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "1. Run: npm run dev" -ForegroundColor White
            Write-Host "2. Enable '3D Realistic Avatar' in settings" -ForegroundColor White
            Write-Host "3. Grant webcam permissions" -ForegroundColor White
            Write-Host "4. Start chatting!" -ForegroundColor White
        } else {
            Write-Host "File selection cancelled." -ForegroundColor Yellow
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "Downloading sample model..." -ForegroundColor Green
        
        # Sample GLB model URL (small test model)
        $sampleUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF-Binary/BrainStem.glb"
        
        try {
            # Ensure directory exists
            if (-not (Test-Path $modelDir)) {
                New-Item -ItemType Directory -Path $modelDir -Force | Out-Null
            }
            
            # Download
            Invoke-WebRequest -Uri $sampleUrl -OutFile $modelPath
            
            Write-Host ""
            Write-Host "✅ Sample model downloaded!" -ForegroundColor Green
            Write-Host "   Location: $modelPath" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "⚠️  This is a basic test model." -ForegroundColor Yellow
            Write-Host "   For best results, replace it with a ReadyPlayerMe avatar." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "1. Run: npm run dev" -ForegroundColor White
            Write-Host "2. Enable '3D Realistic Avatar' in settings" -ForegroundColor White
            Write-Host "3. Test the avatar" -ForegroundColor White
            Write-Host "4. Replace with better model using option 1" -ForegroundColor White
        }
        catch {
            Write-Host ""
            Write-Host "❌ Download failed: $_" -ForegroundColor Red
            Write-Host "Please try option 1 or 3 instead." -ForegroundColor Yellow
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "Opening setup guide..." -ForegroundColor Green
        
        $guidePath = "g:\Daksh_Library\Avatar_chatbot\REALISTIC_AVATAR_GUIDE.md"
        $modelsReadme = "g:\Daksh_Library\Avatar_chatbot\public\models\README.md"
        
        if (Test-Path $guidePath) {
            Start-Process $guidePath
        }
        
        if (Test-Path $modelsReadme) {
            Start-Process $modelsReadme
        }
        
        # Open models folder
        if (Test-Path $modelDir) {
            Start-Process $modelDir
        }
        
        Write-Host ""
        Write-Host "📖 Guide opened in your default editor" -ForegroundColor Green
        Write-Host "📁 Models folder opened" -ForegroundColor Green
        Write-Host ""
        Write-Host "After placing head.glb in the models folder:" -ForegroundColor Cyan
        Write-Host "1. Run: npm run dev" -ForegroundColor White
        Write-Host "2. Enable '3D Realistic Avatar' in settings" -ForegroundColor White
        Write-Host "3. Grant webcam permissions" -ForegroundColor White
        Write-Host "4. Start chatting!" -ForegroundColor White
    }
    
    default {
        Write-Host ""
        Write-Host "Invalid choice. Please run again and select 1, 2, or 3." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
