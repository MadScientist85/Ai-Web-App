# HuggingFace Spaces deployment wrapper
import os
import subprocess
import sys
from pathlib import Path

def install_dependencies():
    """Install Node.js dependencies"""
    try:
        subprocess.run(["npm", "install"], check=True, cwd=".")
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        sys.exit(1)

def build_app():
    """Build the Next.js application"""
    try:
        subprocess.run(["npm", "run", "build"], check=True, cwd=".")
        print("✅ Application built successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to build application: {e}")
        sys.exit(1)

def start_server():
    """Start the Next.js server"""
    try:
        # Set environment variables
        os.environ["PORT"] = "7860"  # HuggingFace Spaces default port
        os.environ["HOSTNAME"] = "0.0.0.0"
        
        # Start the server
        subprocess.run(["npm", "start"], check=True, cwd=".")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🚀 Starting WEB.BUILDING.GENIOUS deployment...")
    
    # Check if this is the first run
    if not Path("node_modules").exists():
        print("📦 Installing dependencies...")
        install_dependencies()
    
    # Check if build exists
    if not Path(".next").exists():
        print("🔨 Building application...")
        build_app()
    
    print("🌐 Starting server...")
    start_server()
