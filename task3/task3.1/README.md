# Jaeger в Minikube с сервисами

## Описание
Развертывание Jaeger в Minikube с двумя сервисами, которые:
1. Взаимодействуют между собой
2. Отправляют трейсы в Jaeger

## Требования
- Minikube
- kubectl
- Docker

## Установка

### 1. Запуск Minikube 
```bash
minikube start --addons=ingress 
```
Ingress нужен для вызовов

### 2. Установка cert-manager
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml
```

### 3. Развертывание Jaeger
```bash
kubectl create namespace observability
kubectl create -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.51.0/jaeger-operator.yaml -n observability
kubectl apply -f k8s/jaeger-instance.yaml
```

### 4. Сборка и деплой сервисов
```bash
# Сборка образов
minikube image build -t service-a:latest services/a/
minikube image build -t service-b:latest services/b/

# Развертывание
kubectl apply -f k8s/services.yaml
```

## Проверка работы

### Доступ к Jaeger UI
```bash
kubectl port-forward svc/simplest-query 16686:16686
```
Откройте в браузере: http://localhost:16686

### Тестирование сервисов
```bash
# Проверка статуса подов (должны быть Running)
kubectl get pods

# Вызов service-a, который вызывает service-b
kubectl exec -it deployment/service-a -- wget -qO- http://service-a:8080
```

## Отладка
Если команда выше выдает ошибку, проверьте:
1. Статус подов: `kubectl get pods`. Если статус `ImagePullBackOff`, значит образ не был собран в minikube.
2. Логи Jaeger Operator: `kubectl logs -n observability -l name=jaeger-operator`.
3. Логи сервиса: `kubectl logs deployment/service-a`.

## Структура проекта
- `services/a/` - Исходный код service-a (сервис расчета)
- `services/b/` - Исходный код service-b (сервис заказов)
- `k8s/services.yaml` - Конфигурация Kubernetes для сервисов
- `k8s/jaeger-instance.yaml` - Конфигурация Jaeger