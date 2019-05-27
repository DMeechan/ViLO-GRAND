# Adapted from:
# https://gist.github.com/mpneuried/0594963ad38e68917ef189b4e6a269db

APP_API="vilo-api"
APP_DB="vilo-neo4j"

# Import config.env file... we don't need this right now

# You can change the default config with `make cnf="config_special.env" build`
# cnf ?= config.env
# include $(cnf)
# export $(shell sed 's/=.*//' $(cnf))

# grep the version from the mix file
# VERSION=$(shell ./version.sh)

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help

help: ## Get info on what each 'make' command does.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

# DOCKER TASKS

run: ## Spin up the project
	docker-compose up -d

seed: ## Populate the Neo4j database with seed data (non functional ATM)
	docker-compose run ${APP_API} npm run seedDb

stop: ## Stop running containers
	docker stop $(APP_API) $(APP_DB)

remove: stop ## Stop and remove running containers
	docker rm $(APP_API) $(APP_DB)

# HELPERS

# version: ## output to version
# 	@echo $(VERSION)