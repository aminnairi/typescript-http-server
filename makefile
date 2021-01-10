.PHONY: install start stop

install:
	docker-compose run --rm npm install

start:
	docker-compose run --rm --service-ports npx ts-node example/main

stop:
	docker-compose down --remove-orphans --volumes --timeout 0
