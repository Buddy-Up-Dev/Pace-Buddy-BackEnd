
if [ "$DEPLOYMENT_GROUP_NAME" == "dev" ]
then
  docker-compose -f /deploy/docker-compose.yml rm -v
  docker-compose -f /deploy/docker-compose.yml up --detach --renew-anon-volumes
elif [ "$DEPLOYMENT_GROUP_NAME" == "stage" ]
then
  docker-compose -f /deploy/docker-compose.yml rm -v
  docker-compose -f /deploy/docker-compose.yml up --detach --renew-anon-volumes
elif [ "$DEPLOYMENT_GROUP_NAME" == "production" ]
then
  docker-compose -f /deploy/docker-compose.yml rm -v
  docker-compose -f /deploy/docker-compose.yml up --detach --renew-anon-volumes
fi