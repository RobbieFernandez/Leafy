def add_icon_to_field(field, icon_name):
    field.icon = icon_name

    def add_icon_to_bound_field(fn):
        def wrapper(*args, **kwargs):
            bound_field = fn(*args, **kwargs)
            bound_field.icon = icon_name
            return bound_field
        return wrapper

    field.get_bound_field = add_icon_to_bound_field(field.get_bound_field)

    return field
