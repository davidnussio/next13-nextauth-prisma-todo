#!/usr/bin/make -f

PROJECT_NAME = $(shell jq -r .name package.json)


init-database:
	docker run --name ${PROJECT_NAME}-mysql -p 3309:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:latest
	# Wait for the database to start
	until $$(nc -z -v -w30 localhost 3309); do \
		echo "Waiting for database connection..."; \
		sleep 5; \
	done
	npx prisma db push
	docker stop ${PROJECT_NAME}-mysql

start-database:
	docker start ${PROJECT_NAME}-mysql
	until $$(nc -z -v -w30 localhost 3309); do \
		echo "Waiting for database connection..."; \
		sleep 5; \
	done

stop-database:
	docker stop ${PROJECT_NAME}-mysql

dev: start-database
	npx turbo dev 

clean:
	rm -rf .next node_modules .turbo playwright-report
