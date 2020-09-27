from django.shortcuts import redirect, render
from django.urls import reverse
from django.contrib.auth import login, authenticate
from django.http.response import HttpResponse

def log_in(request):
    def redirect_to_dashboard():
        return redirect(reverse('plant-dashbaord'))

    def render_login_page():
        return render(request, 'login.html')

    if request.method == 'GET':
        if request.user.is_authenticated:
            return redirect_to_dashboard()
        return render_login_page()
    elif request.method == 'POST':
        user = authenticate(
            request,
            username=request.POST['username'],
            password=request.POST['password']
        )

        if user is not None:
            login(request, user)
            return redirect_to_dashboard()
        else:
            # TODO - Add message
            return render_login_page()

    response = HttpResponse()
    response.status_code = 405
    return response
