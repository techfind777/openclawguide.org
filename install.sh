#!/usr/bin/env bash
#
# OpenClaw EasySetup — The Idiot-Proof Installer
# https://openclawguide.org
#
# Usage: curl -fsSL https://openclawguide.org/install.sh | bash
#
# What this does:
# 1. Installs OpenClaw (handles Node.js, dependencies, everything)
# 2. Walks you through configuration with simple yes/no questions
# 3. Sets up your AI model (Claude, GPT, Gemini, DeepSeek, or local)
# 4. Connects your messaging channel (Telegram, Discord, Slack, etc.)
# 5. Creates a SOUL.md personality for your agent
# 6. Hardens security (firewall, SSH, auto-updates)
# 7. Starts everything and verifies it works
#
# Requirements: A fresh Ubuntu 22.04+ or Debian 12+ server with root access
# Tested on: Hostinger VPS, DigitalOcean, Vultr, Hetzner, Oracle Cloud
#
# License: MIT
# Author: OpenClaw Guide (openclawguide.org)
#

set -euo pipefail

# ─── Colors ───
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Helpers ───
info()    { echo -e "${BLUE}ℹ${NC}  $*"; }
success() { echo -e "${GREEN}✓${NC}  $*"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $*"; }
error()   { echo -e "${RED}✗${NC}  $*"; }
step()    { echo -e "\n${CYAN}${BOLD}━━━ Step $1: $2 ━━━${NC}\n"; }
ask()     { echo -en "${BOLD}$*${NC} "; }

banner() {
  echo -e "${CYAN}"
  echo "  ╔═══════════════════════════════════════════════╗"
  echo "  ║     🦞 OpenClaw EasySetup Installer v1.0     ║"
  echo "  ║         openclawguide.org                     ║"
  echo "  ╚═══════════════════════════════════════════════╝"
  echo -e "${NC}"
  echo "  This script will set up a complete OpenClaw AI agent"
  echo "  on this server. It takes about 10-15 minutes."
  echo ""
  echo "  You'll need:"
  echo "    • An API key for your AI model (Claude, GPT, etc.)"
  echo "    • A bot token for your messaging app (Telegram, Discord, etc.)"
  echo ""
}

confirm() {
  ask "$1 [Y/n]:"
  read -r response
  response=${response:-Y}
  [[ "$response" =~ ^[Yy] ]]
}

# ─── Pre-flight checks ───
preflight() {
  step "1/7" "Checking your system"

  # Must be root or sudo
  if [[ $EUID -ne 0 ]]; then
    error "Please run as root: sudo bash install.sh"
    exit 1
  fi
  success "Running as root"

  # Check OS
  if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    info "Detected OS: $PRETTY_NAME"
    if [[ "$ID" != "ubuntu" && "$ID" != "debian" && "$ID" != "centos" && "$ID" != "rocky" && "$ID" != "almalinux" && "$ID" != "fedora" && "$ID" != "opencloudos" ]]; then
      warn "This script is optimized for Ubuntu/Debian. Other distros may work but are not fully tested."
      if ! confirm "Continue anyway?"; then
        exit 1
      fi
    fi
  fi

  # Check RAM
  total_ram_mb=$(free -m | awk '/^Mem:/{print $2}')
  if [[ $total_ram_mb -lt 1800 ]]; then
    error "Your server has ${total_ram_mb}MB RAM. OpenClaw needs at least 2GB."
    error "Upgrade your VPS plan or try a provider with more RAM."
    echo ""
    info "Recommended: Hostinger KVM 2 (8GB RAM, \$6.99/mo)"
    info "  → https://openclawguide.org/best-vps-for-openclaw"
    exit 1
  fi
  success "RAM: ${total_ram_mb}MB (minimum 2GB ✓)"

  # Check disk
  free_disk_gb=$(df -BG / | awk 'NR==2{print $4}' | tr -d 'G')
  if [[ $free_disk_gb -lt 5 ]]; then
    error "Only ${free_disk_gb}GB free disk space. Need at least 5GB."
    exit 1
  fi
  success "Disk: ${free_disk_gb}GB free (minimum 5GB ✓)"

  # Check internet
  if ! ping -c 1 -W 3 8.8.8.8 &>/dev/null; then
    error "No internet connection detected."
    exit 1
  fi
  success "Internet connection ✓"

  echo ""
  success "System checks passed!"
}

# ─── Install OpenClaw ───
install_openclaw() {
  step "2/7" "Installing OpenClaw"

  info "This will install Node.js 22+ and OpenClaw. Takes 2-5 minutes..."
  echo ""

  # Use official installer
  if command -v openclaw &>/dev/null; then
    warn "OpenClaw is already installed!"
    openclaw --version 2>/dev/null || true
    if confirm "Reinstall/update?"; then
      npm update -g openclaw 2>/dev/null || true
    fi
  else
    info "Running official OpenClaw installer..."
    curl -fsSL --proto '=https' --tlsv1.2 https://openclaw.ai/install.sh | bash -s -- --no-onboard 2>&1 || {
      error "Installation failed. Check the output above for errors."
      echo ""
      info "Common fixes:"
      info "  1. Run: export PATH=\"\$(npm prefix -g)/bin:\$PATH\""
      info "  2. Try again: curl -fsSL https://openclaw.ai/install.sh | bash"
      info "  3. Manual install: https://docs.openclaw.ai/install"
      exit 1
    }
  fi

  # Verify
  if command -v openclaw &>/dev/null; then
    success "OpenClaw installed: $(openclaw --version 2>/dev/null || echo 'OK')"
  else
    # Try adding to PATH
    export PATH="$(npm prefix -g 2>/dev/null)/bin:$PATH"
    if command -v openclaw &>/dev/null; then
      success "OpenClaw installed (added to PATH)"
      # Persist PATH
      echo "export PATH=\"$(npm prefix -g)/bin:\$PATH\"" >> ~/.bashrc
    else
      error "OpenClaw installed but not found in PATH."
      info "Try: export PATH=\"\$(npm prefix -g)/bin:\$PATH\""
      exit 1
    fi
  fi
}

# ─── Configure AI Model ───
configure_model() {
  step "3/7" "Setting up your AI model"

  echo "Which AI model do you want to use?"
  echo ""
  echo "  1) Claude (Anthropic) — Best quality, recommended"
  echo "  2) GPT-4o (OpenAI) — Great alternative"
  echo "  3) Gemini (Google) — Good and cheap"
  echo "  4) DeepSeek — Cheapest cloud option"
  echo "  5) Local model (Ollama) — Free, needs 8GB+ RAM"
  echo "  6) OpenRouter — Access all models with one key"
  echo ""
  ask "Choose [1-6]:"
  read -r model_choice
  model_choice=${model_choice:-1}

  case $model_choice in
    1)
      MODEL_PROVIDER="anthropic"
      MODEL_NAME="claude-sonnet-4-20250514"
      echo ""
      info "Get your Anthropic API key at: https://console.anthropic.com/settings/keys"
      echo ""
      ask "Paste your Anthropic API key:"
      read -r API_KEY
      ;;
    2)
      MODEL_PROVIDER="openai"
      MODEL_NAME="gpt-4o"
      echo ""
      info "Get your OpenAI API key at: https://platform.openai.com/api-keys"
      echo ""
      ask "Paste your OpenAI API key:"
      read -r API_KEY
      ;;
    3)
      MODEL_PROVIDER="google"
      MODEL_NAME="gemini-2.5-flash"
      echo ""
      info "Get your Google AI key at: https://aistudio.google.com/apikey"
      echo ""
      ask "Paste your Google AI API key:"
      read -r API_KEY
      ;;
    4)
      MODEL_PROVIDER="deepseek"
      MODEL_NAME="deepseek-chat"
      echo ""
      info "Get your DeepSeek API key at: https://platform.deepseek.com/api_keys"
      echo ""
      ask "Paste your DeepSeek API key:"
      read -r API_KEY
      ;;
    5)
      MODEL_PROVIDER="ollama"
      MODEL_NAME="llama3.1:8b"
      API_KEY=""
      info "Will install Ollama and download llama3.1:8b model..."
      if ! command -v ollama &>/dev/null; then
        curl -fsSL https://ollama.com/install.sh | sh
      fi
      ollama pull llama3.1:8b &
      ;;
    6)
      MODEL_PROVIDER="openrouter"
      MODEL_NAME="anthropic/claude-sonnet-4"
      echo ""
      info "Get your OpenRouter key at: https://openrouter.ai/keys"
      echo ""
      ask "Paste your OpenRouter API key:"
      read -r API_KEY
      ;;
    *)
      warn "Invalid choice, defaulting to Claude"
      MODEL_PROVIDER="anthropic"
      MODEL_NAME="claude-sonnet-4-20250514"
      ask "Paste your Anthropic API key:"
      read -r API_KEY
      ;;
  esac

  if [[ -n "${API_KEY:-}" ]]; then
    success "API key saved (${#API_KEY} characters)"
  fi
}

# ─── Configure Channel ───
configure_channel() {
  step "4/7" "Connecting your messaging app"

  echo "Which messaging app do you want to connect?"
  echo ""
  echo "  1) Telegram — Most popular, easiest setup"
  echo "  2) Discord — Great for communities"
  echo "  3) Slack — For work"
  echo "  4) WhatsApp — Via WhatsApp Business API"
  echo "  5) Signal — Privacy-focused"
  echo "  6) None for now — I'll use the web UI"
  echo ""
  ask "Choose [1-6]:"
  read -r channel_choice
  channel_choice=${channel_choice:-1}

  CHANNEL_TYPE=""
  CHANNEL_CONFIG=""

  case $channel_choice in
    1)
      CHANNEL_TYPE="telegram"
      echo ""
      info "To create a Telegram bot:"
      info "  1. Open Telegram and search for @BotFather"
      info "  2. Send /newbot"
      info "  3. Follow the prompts to name your bot"
      info "  4. Copy the bot token (looks like: 123456:ABC-DEF...)"
      echo ""
      ask "Paste your Telegram bot token:"
      read -r BOT_TOKEN
      CHANNEL_CONFIG="telegram:
  enabled: true
  token: \"${BOT_TOKEN}\""
      success "Telegram configured"
      ;;
    2)
      CHANNEL_TYPE="discord"
      echo ""
      info "To create a Discord bot:"
      info "  1. Go to https://discord.com/developers/applications"
      info "  2. Click 'New Application' → name it → go to 'Bot' tab"
      info "  3. Click 'Reset Token' and copy it"
      info "  4. Enable 'Message Content Intent' under Privileged Intents"
      info "  5. Go to OAuth2 → URL Generator → select 'bot' scope"
      info "  6. Use the generated URL to invite the bot to your server"
      echo ""
      ask "Paste your Discord bot token:"
      read -r BOT_TOKEN
      CHANNEL_CONFIG="discord:
  enabled: true
  token: \"${BOT_TOKEN}\""
      success "Discord configured"
      ;;
    3)
      CHANNEL_TYPE="slack"
      echo ""
      info "Slack setup requires a Slack App. See: https://docs.openclaw.ai/channels/slack"
      ask "Paste your Slack bot token (xoxb-...):"
      read -r BOT_TOKEN
      ask "Paste your Slack app token (xapp-...):"
      read -r APP_TOKEN
      CHANNEL_CONFIG="slack:
  enabled: true
  botToken: \"${BOT_TOKEN}\"
  appToken: \"${APP_TOKEN}\""
      success "Slack configured"
      ;;
    4)
      CHANNEL_TYPE="whatsapp"
      info "WhatsApp requires Business API setup. See: https://docs.openclaw.ai/channels/whatsapp"
      warn "Skipping WhatsApp for now — you can add it later in config.yaml"
      ;;
    5)
      CHANNEL_TYPE="signal"
      info "Signal requires signal-cli setup. See: https://docs.openclaw.ai/channels/signal"
      warn "Skipping Signal for now — you can add it later in config.yaml"
      ;;
    6)
      info "No channel selected. You can use the web UI at http://YOUR_IP:18789"
      ;;
  esac
}

# ─── Create SOUL.md ───
create_soul() {
  step "5/7" "Designing your agent's personality"

  echo "Choose a personality template for your AI agent:"
  echo ""
  echo "  1) Personal Assistant — Helpful, organized, proactive"
  echo "  2) Technical Expert — Precise, detailed, developer-focused"
  echo "  3) Creative Partner — Imaginative, brainstorming, content-focused"
  echo "  4) Business Analyst — Data-driven, strategic, professional"
  echo "  5) Custom — I'll write my own later"
  echo ""
  ask "Choose [1-5]:"
  read -r soul_choice
  soul_choice=${soul_choice:-1}

  ask "What should your agent's name be? [default: Atlas]:"
  read -r AGENT_NAME
  AGENT_NAME=${AGENT_NAME:-Atlas}

  WORKSPACE_DIR="$HOME/.openclaw/workspace"
  mkdir -p "$WORKSPACE_DIR"

  case $soul_choice in
    1)
      cat > "$WORKSPACE_DIR/SOUL.md" << SOULEOF
# SOUL.md — ${AGENT_NAME}

You are ${AGENT_NAME}, a personal AI assistant.

## Personality
- Helpful, organized, and proactive
- You anticipate needs before being asked
- You communicate clearly and concisely
- You remember context from previous conversations

## Communication Style
- Be direct and actionable
- Use bullet points for clarity
- Suggest next steps when appropriate
- Ask clarifying questions when needed

## Capabilities
- Task management and reminders
- Research and information gathering
- Writing and editing
- Technical problem-solving
- Calendar and schedule management

## Rules
- Always prioritize accuracy over speed
- If unsure, say so and suggest alternatives
- Protect user privacy — never share personal information
- Be honest about limitations
SOULEOF
      ;;
    2)
      cat > "$WORKSPACE_DIR/SOUL.md" << SOULEOF
# SOUL.md — ${AGENT_NAME}

You are ${AGENT_NAME}, a technical expert and developer assistant.

## Personality
- Precise, thorough, and detail-oriented
- You write clean, well-documented code
- You explain complex concepts simply
- You follow best practices and security standards

## Communication Style
- Code-first: show, don't just tell
- Include relevant documentation links
- Explain trade-offs between approaches
- Use technical language appropriately

## Capabilities
- Code review and debugging
- Architecture design
- DevOps and deployment
- Security analysis
- Performance optimization

## Rules
- Always consider security implications
- Test before recommending
- Cite sources for technical claims
- Prefer simple solutions over clever ones
SOULEOF
      ;;
    3)
      cat > "$WORKSPACE_DIR/SOUL.md" << SOULEOF
# SOUL.md — ${AGENT_NAME}

You are ${AGENT_NAME}, a creative partner and content strategist.

## Personality
- Imaginative, enthusiastic, and inspiring
- You generate ideas freely and build on concepts
- You balance creativity with practicality
- You adapt your style to different audiences

## Communication Style
- Energetic but not overwhelming
- Use vivid language and examples
- Offer multiple creative directions
- Balance inspiration with actionable steps

## Capabilities
- Content creation and editing
- Brainstorming and ideation
- Social media strategy
- Copywriting and storytelling
- Brand voice development
SOULEOF
      ;;
    4)
      cat > "$WORKSPACE_DIR/SOUL.md" << SOULEOF
# SOUL.md — ${AGENT_NAME}

You are ${AGENT_NAME}, a business analyst and strategic advisor.

## Personality
- Data-driven, analytical, and strategic
- You focus on ROI and measurable outcomes
- You present options with clear trade-offs
- You think in systems and frameworks

## Communication Style
- Lead with conclusions, then supporting data
- Use tables and comparisons
- Quantify whenever possible
- Present A/B/C options with recommendations

## Capabilities
- Market research and analysis
- Financial modeling
- Strategic planning
- Competitive analysis
- Process optimization
SOULEOF
      ;;
    5)
      cat > "$WORKSPACE_DIR/SOUL.md" << SOULEOF
# SOUL.md — ${AGENT_NAME}

You are ${AGENT_NAME}, an AI assistant.

Edit this file to customize your agent's personality, capabilities, and rules.
See https://openclawguide.org for SOUL.md templates and guides.
SOULEOF
      ;;
  esac

  success "SOUL.md created at $WORKSPACE_DIR/SOUL.md"
}

# ─── Security Hardening ───
harden_security() {
  step "6/7" "Securing your server"

  info "Applying basic security hardening..."

  # UFW Firewall
  if command -v ufw &>/dev/null; then
    ufw --force reset >/dev/null 2>&1
    ufw default deny incoming >/dev/null 2>&1
    ufw default allow outgoing >/dev/null 2>&1
    ufw allow 22/tcp >/dev/null 2>&1    # SSH
    ufw allow 18789/tcp >/dev/null 2>&1  # OpenClaw dashboard
    ufw --force enable >/dev/null 2>&1
    success "Firewall enabled (SSH + OpenClaw ports only)"
  else
    warn "UFW not found, skipping firewall setup"
    if command -v apt-get &>/dev/null; then
      apt-get install -y ufw >/dev/null 2>&1
      ufw default deny incoming >/dev/null 2>&1
      ufw default allow outgoing >/dev/null 2>&1
      ufw allow 22/tcp >/dev/null 2>&1
      ufw allow 18789/tcp >/dev/null 2>&1
      ufw --force enable >/dev/null 2>&1
      success "Firewall installed and enabled"
    fi
  fi

  # Auto-updates
  if command -v apt-get &>/dev/null; then
    apt-get install -y unattended-upgrades >/dev/null 2>&1
    dpkg-reconfigure -plow unattended-upgrades >/dev/null 2>&1 || true
    success "Automatic security updates enabled"
  fi

  # Fail2ban
  if command -v apt-get &>/dev/null; then
    apt-get install -y fail2ban >/dev/null 2>&1
    systemctl enable fail2ban >/dev/null 2>&1
    systemctl start fail2ban >/dev/null 2>&1
    success "Fail2ban installed (SSH brute-force protection)"
  fi

  success "Basic security hardening complete"
}

# ─── Write Config & Start ───
finalize() {
  step "7/7" "Starting OpenClaw"

  # Run onboarding with collected info
  info "Writing configuration..."

  # Let openclaw onboard handle the config writing
  # We pass our collected values
  if [[ -n "${API_KEY:-}" ]]; then
    case $MODEL_PROVIDER in
      anthropic)
        export ANTHROPIC_API_KEY="$API_KEY"
        ;;
      openai)
        export OPENAI_API_KEY="$API_KEY"
        ;;
      google)
        export GOOGLE_AI_API_KEY="$API_KEY"
        ;;
      deepseek)
        export DEEPSEEK_API_KEY="$API_KEY"
        ;;
      openrouter)
        export OPENROUTER_API_KEY="$API_KEY"
        ;;
    esac
  fi

  # Run onboard wizard (non-interactive parts already set)
  openclaw onboard --install-daemon 2>&1 || {
    warn "Onboarding wizard had issues. Trying manual config..."

    # Write config manually
    CONFIG_DIR="$HOME/.openclaw"
    mkdir -p "$CONFIG_DIR"

    cat > "$CONFIG_DIR/config.yaml" << CFGEOF
# OpenClaw Configuration — Generated by EasySetup
# https://openclawguide.org

model:
  provider: ${MODEL_PROVIDER}
  name: ${MODEL_NAME}

${CHANNEL_CONFIG:-}

gateway:
  port: 18789
CFGEOF

    success "Config written to $CONFIG_DIR/config.yaml"
  }

  # Start gateway
  info "Starting OpenClaw gateway..."
  openclaw gateway start 2>&1 || openclaw gateway --port 18789 &

  sleep 3

  # Verify
  if openclaw gateway status 2>/dev/null | grep -qi "running\|active\|ok"; then
    success "OpenClaw is running!"
  else
    warn "Gateway may still be starting. Check with: openclaw gateway status"
  fi

  # Get server IP
  SERVER_IP=$(curl -s -4 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

  echo ""
  echo -e "${GREEN}${BOLD}"
  echo "  ╔═══════════════════════════════════════════════╗"
  echo "  ║        🎉 OpenClaw is ready!                  ║"
  echo "  ╚═══════════════════════════════════════════════╝"
  echo -e "${NC}"
  echo ""
  echo "  📊 Dashboard: http://${SERVER_IP}:18789"
  echo "  📁 Config:    ~/.openclaw/config.yaml"
  echo "  🧠 SOUL.md:   ~/.openclaw/workspace/SOUL.md"
  echo ""
  if [[ -n "${CHANNEL_TYPE:-}" ]]; then
    echo "  💬 Send a message to your bot on ${CHANNEL_TYPE} to test!"
  else
    echo "  💬 Open the dashboard URL above to start chatting!"
  fi
  echo ""
  echo "  Useful commands:"
  echo "    openclaw status        — Check status"
  echo "    openclaw gateway stop  — Stop the agent"
  echo "    openclaw gateway start — Start the agent"
  echo "    openclaw doctor        — Diagnose issues"
  echo ""
  echo -e "  ${CYAN}Need help? Visit https://openclawguide.org${NC}"
  echo -e "  ${CYAN}Free templates: https://leimspire20.gumroad.com/l/kqbdva${NC}"
  echo ""
}

# ─── Main ───
main() {
  banner

  if ! confirm "Ready to install OpenClaw?"; then
    echo "No problem. Visit https://openclawguide.org when you're ready."
    exit 0
  fi

  preflight
  install_openclaw
  configure_model
  configure_channel
  create_soul
  harden_security
  finalize
}

main "$@"
