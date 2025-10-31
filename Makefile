# vineyardgroupfellowship Frontend Makefile
# Provides common development tasks and workflow automation

.PHONY: help install dev build preview lint lint-fix clean test docker-build docker-run docker-dev setup deploy

# Default target
.DEFAULT_GOAL := help

# Colors for pretty output
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

##@ Development

help: ## Show this help message
	@echo "$(BLUE)vineyardgroupfellowship Frontend - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

setup: ## Complete project setup (install dependencies and setup environment)
	@echo "$(BLUE)Setting up vineyardgroupfellowship Frontend...$(NC)"
	@if ! command -v yarn >/dev/null 2>&1; then \
		echo "$(RED)Error: yarn is not installed. Please install yarn first.$(NC)"; \
		exit 1; \
	fi
	@if ! command -v node >/dev/null 2>&1; then \
		echo "$(RED)Error: Node.js is not installed. Please install Node.js 20+ first.$(NC)"; \
		exit 1; \
	fi
	yarn install
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)Creating .env from .env.example...$(NC)"; \
		cp .env.example .env; \
	fi
	@echo "$(GREEN)✓ Setup complete! Run 'make dev' to start development.$(NC)"

install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	yarn install

dev: ## Start development server on port 3000
	@echo "$(BLUE)Starting development server...$(NC)"
	yarn dev

build: ## Build for production
	@echo "$(BLUE)Building for production...$(NC)"
	yarn build

preview: ## Preview production build locally
	@echo "$(BLUE)Starting preview server...$(NC)"
	yarn preview

##@ Quality Assurance

lint: ## Run ESLint to check code quality
	@echo "$(BLUE)Running ESLint...$(NC)"
	yarn lint

lint-fix: ## Run ESLint and automatically fix issues
	@echo "$(BLUE)Running ESLint with auto-fix...$(NC)"
	yarn lint --fix

typecheck: ## Run TypeScript type checking
	@echo "$(BLUE)Running TypeScript type check...$(NC)"
	yarn build --emptyOutDir=false

test: ## Run tests (placeholder for when tests are added)
	@echo "$(YELLOW)Tests not yet implemented. Run 'yarn add -D vitest @testing-library/react' to add testing.$(NC)"

##@ Docker Operations

docker-build: ## Build Docker image for production
	@echo "$(BLUE)Building Docker image...$(NC)"
	docker build -t vineyardgroupfellowship-frontend .

docker-run: ## Run production Docker container locally
	@echo "$(BLUE)Running Docker container...$(NC)"
	docker run -p 8080:80 --name vineyardgroupfellowship-frontend-local vineyardgroupfellowship-frontend

docker-dev: ## Run development environment with Docker Compose
	@echo "$(BLUE)Starting Docker Compose development environment...$(NC)"
	docker-compose up --build

docker-stop: ## Stop Docker containers
	@echo "$(BLUE)Stopping Docker containers...$(NC)"
	@docker stop vineyardgroupfellowship-frontend-local 2>/dev/null || true
	@docker-compose down 2>/dev/null || true

docker-clean: ## Clean up Docker containers and images
	@echo "$(BLUE)Cleaning up Docker resources...$(NC)"
	@docker rm vineyardgroupfellowship-frontend-local 2>/dev/null || true
	@docker rmi vineyardgroupfellowship-frontend 2>/dev/null || true
	@docker-compose down --rmi all --volumes 2>/dev/null || true

##@ Deployment

deploy-railway: ## Deploy to Railway (requires Railway CLI)
	@echo "$(BLUE)Deploying to Railway...$(NC)"
	@if ! command -v railway >/dev/null 2>&1; then \
		echo "$(RED)Error: Railway CLI not installed. Install from https://docs.railway.app/develop/cli$(NC)"; \
		exit 1; \
	fi
	railway up

deploy-prepare: ## Prepare deployment files and run build
	@echo "$(BLUE)Preparing for deployment...$(NC)"
	make lint
	make typecheck
	make build
	@echo "$(GREEN)✓ Ready for deployment!$(NC)"

##@ Utilities

clean: ## Clean build artifacts and dependencies
	@echo "$(BLUE)Cleaning project...$(NC)"
	rm -rf dist/
	rm -rf node_modules/
	rm -rf .yarn/cache/
	@echo "$(GREEN)✓ Project cleaned!$(NC)"

fresh: clean install ## Clean install (remove node_modules and reinstall)
	@echo "$(GREEN)✓ Fresh install complete!$(NC)"

update: ## Update dependencies
	@echo "$(BLUE)Updating dependencies...$(NC)"
	yarn upgrade

env-check: ## Check environment variables and configuration
	@echo "$(BLUE)Environment Configuration Check:$(NC)"
	@echo "Node.js: $$(node --version 2>/dev/null || echo '$(RED)Not installed$(NC)')"
	@echo "Yarn: $$(yarn --version 2>/dev/null || echo '$(RED)Not installed$(NC)')"
	@echo "Docker: $$(docker --version 2>/dev/null | cut -d' ' -f3 | cut -d',' -f1 || echo '$(RED)Not installed$(NC)')"
	@echo "Git: $$(git --version 2>/dev/null | cut -d' ' -f3 || echo '$(RED)Not installed$(NC)')"
	@echo ""
	@echo "Environment files:"
	@ls -la .env* 2>/dev/null || echo "$(YELLOW)No .env files found$(NC)"

##@ Git Operations

git-setup: ## Setup git hooks and configuration
	@echo "$(BLUE)Setting up git configuration...$(NC)"
	@if [ ! -d .git ]; then \
		echo "$(RED)Error: Not a git repository. Run 'git init' first.$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✓ Git setup complete!$(NC)"

commit: ## Create a commit with staged changes
	@echo "$(BLUE)Creating commit...$(NC)"
	@if [ -z "$(MSG)" ]; then \
		echo "$(RED)Error: Please provide a commit message with MSG='your message'$(NC)"; \
		exit 1; \
	fi
	git add -A
	git commit -m "$(MSG)"

push: ## Push to remote repository
	@echo "$(BLUE)Pushing to remote...$(NC)"
	git push origin main

##@ Information

info: ## Show project information
	@echo "$(BLUE)vineyardgroupfellowship Frontend Project Information$(NC)"
	@echo "Repository: vineyardgroupfellowship-frontend"
	@echo "Technology: React 19.2 + TypeScript + Vite 7"
	@echo "Port: 3000 (development)"
	@echo "Build Tool: Vite with SWC"
	@echo "Package Manager: Yarn"
	@echo "Deployment: Railway with Docker"
	@echo ""
	@echo "Key Features:"
	@echo "  • Modern React with concurrent features"
	@echo "  • TypeScript strict mode"
	@echo "  • React Aria Components for accessibility"
	@echo "  • TanStack Query for server state"
	@echo "  • SCSS modules with Open Props design tokens"
	@echo "  • Docker multi-stage builds"
	@echo "  • Railway deployment with nginx"